<?php
    //headers
    header('Access-Control-Allow-Origin: *');
    header('Content-Type: application/json');
    header('Access-Control-Allow-Methods: POST');
    header('Access-Control-Allow-Headers: Access-Control-Allow-Headers,Content-Type,Access-Control-Allow-Methods,Authorization,');

    require("../../config/config.php");
    require("../../vendor/autoload.php");
    
    use Ramsey\Uuid\Uuid;

    require("destination.php");

    $destination = new Destination();

    if (!isset($_SERVER['PHP_AUTH_USER']) || !isset($_SERVER['PHP_AUTH_PW'])){
        echo json_encode([
            "message" => "Authentication Failed !!"
        ]);
        return;
    } else {
        $username = $_SERVER['PHP_AUTH_USER'];
        $password = $_SERVER['PHP_AUTH_PW'];
    }

    $check_user = $destination->verify_user($con, $username, $password);
    $json_response = json_decode($check_user, true);

    if ($json_response['msg'] == 'true') {
        $id = $json_response['id'];

        $data = json_decode(file_get_contents("php://input"));

        $type = $data->type;
        $destination_number = $data->destination;
        $caller_id_name = $data->caller_id_name;
        $caller_id_number = $data->caller_id_number;
        $destination_condition = $data->destination_condition;
        $destination_action = $data->destination_action;
        $domain = $data->domain;
        $user = $data->user;
        $description = $data->description;
        $destination_enabled = $data->destination_enabled;
        $destination_prefix = $data->destination_prefix;
        $trunk_uuid = $data->trunk_id;

        $query = "SELECT * FROM public.v_destinations WHERE destination_number ='$destination_number' and domain_uuid='$domain' ";
        $check_destination = pg_query($con, $query);


        if (pg_num_rows($check_destination) > 0 ) {

            echo json_encode([
                "message" => $destination_number." Destination already exist !!"
            ]);
            
        }else{

            $uuid = Uuid::uuid4();
            // Get the UUID as a string
            $uuidDestination = $uuid->toString();

            if ($destination_enabled == "true" || $destination_enabled == "false") {
                $destination->post($con, $type, $destination_number, $caller_id_name, $caller_id_number, $destination_condition, $destination_action, $domain, $user, $description, $destination_enabled, $uuidDestination, $id, $destination_prefix,'add',$trunk_uuid);
            } else {
                echo json_encode([
                    "message" => "Destination Enabled Value Must be either True or False !!"
                ]);
            }

        }        
        
        
    } else {
        header('WWW-Authenticate: Basic realm="My Realm"');
        header('HTTP/1.0 401 Unauthorized');
        echo json_encode([
            "message" => "Authentication Failed !!"
        ]);
        exit;
    }
?>