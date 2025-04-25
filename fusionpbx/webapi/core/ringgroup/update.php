<?php
    //headers
    header('Access-Control-Allow-Origin: *');
    header('Content-Type: application/json');
    header('Access-Control-Allow-Methods: PUT');
    header('Access-Control-Allow-Headers: Access-Control-Allow-Headers,Content-Type,Access-Control-Allow-Methods,Authorization,');

    require("../../config/config.php");
    require("../../vendor/autoload.php");
    require("../classes/validateExtension.php");
    
    use Ramsey\Uuid\Uuid;

    require("ringgroup.php");

    $ringGroup = new RingGroup();

    if (!isset($_SERVER['PHP_AUTH_USER']) || !isset($_SERVER['PHP_AUTH_PW'])){
        echo json_encode([
            "message" => "Authentication Failed !!"
        ]);
        return;
    } else {
        $username = $_SERVER['PHP_AUTH_USER'];
        $password = $_SERVER['PHP_AUTH_PW'];
    }

    $check_user = $ringGroup->verify_user($con, $username, $password);
    $json_response = json_decode($check_user, true);

    if ($json_response['msg'] == 'true') {
        if ($_SERVER['REQUEST_METHOD'] === 'PUT') {
            $id = $json_response['id'];
            $data = json_decode(file_get_contents("php://input"));
            
            // $name = $data->name;
            $extension = $data->extension;
            $domain = $data->domain_id;
            // $context = $data->context;
            // $ring_group_strategy = $data->ring_group_strategy;
            $ring_group_enabled = $data->ring_group_enabled;
            $ring_group_id = $data->ring_group_id;

            $ring_group_destinations = $data->ring_group_destinations;

            $check_ext = validateExtension::validate($con, $extension, $domain, $ring_group_id);

            if(!isset($check_ext['app'])){

                if ($ring_group_enabled == "true" || $ring_group_enabled == "false") {
                    $ringGroup->update($con, $data, $id);
                } else {
                    echo json_encode([
                        "message" => "Ring Group Enabled Value Must be either True or False !!"
                    ]);
                }

            }else{
                echo json_encode([
                    "message" => $check_ext['extension']." ".$check_ext['app']." alreay available !!"
                ]);
            }

        } else {
            echo json_encode([
                "message" => "Invalid Method !!"
            ]);
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