<?php
    //headers
    header('Access-Control-Allow-Origin: *');
    header('Content-Type: application/json');
    header('Access-Control-Allow-Methods: POST');
    header('Access-Control-Allow-Headers: Access-Control-Allow-Headers,Content-Type,Access-Control-Allow-Methods,Authorization,');

    require("../../config/config.php");
    require("../../vendor/autoload.php");
    require("../classes/validateExtension.php");
    
    use Ramsey\Uuid\Uuid;

    require("ivr.php");

    $ivr = new IVR();

    if (!isset($_SERVER['PHP_AUTH_USER']) || !isset($_SERVER['PHP_AUTH_PW'])){
        echo json_encode([
            "message" => "Authentication Failed !!"
        ]);
        return;
    } else {
        $username = $_SERVER['PHP_AUTH_USER'];
        $password = $_SERVER['PHP_AUTH_PW'];
    }

    $check_user = $ivr->verify_user($con, $username, $password);
    $json_response = json_decode($check_user, true);

    if ($json_response['msg'] == 'true') {
        $id = $json_response['id'];
        $data = json_decode(file_get_contents("php://input"));

        // $name = $data->name;
         $extension = $data->extension;
        // $greet_long = $data->greet_long;
        // $greet_short = $data->greet_short;
         $domain = $data->domain_id;
        // $context = $data->context;
        // $description = $data->description;
        $ivr_enabled = $data->ivr_enabled;

        $check_ext = validateExtension::validate($con,$extension,$domain);

        if(!isset($check_ext['app'])){
        
            $uuid = Uuid::uuid4();
            // Get the UUID as a string
            $uuidIVR = $uuid->toString();

            if ($ivr_enabled == "true" || $ivr_enabled == "false") {
                $ivr->post($con, $uuidIVR, $data, $id);
            } else {
                echo json_encode([
                    "message" => "IVR Enabled Value Must be either True or False !!"
                ]);
            }

        }else{
            echo json_encode([
                "message" => $check_ext['extension']." ".$check_ext['app']." alreay available !!"
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