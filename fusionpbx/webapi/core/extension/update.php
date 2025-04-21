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

    require("extension.php");

    $extensions = new Extension();

    if (!isset($_SERVER['PHP_AUTH_USER']) || !isset($_SERVER['PHP_AUTH_PW'])){
        echo json_encode([
            "message" => "Authentication Failed !!"
        ]);
        return;
    } else {
        $username = $_SERVER['PHP_AUTH_USER'];
        $password = $_SERVER['PHP_AUTH_PW'];
    }

    $check_user = $extensions->verify_user($con, $username, $password);
    $json_response = json_decode($check_user, true);

    if ($json_response['msg'] == 'true') {
        $id = $json_response['id'];

        $data = json_decode(file_get_contents("php://input"));

        $extension = $data->extension;
        $voicemail_password = $data->extension_password;
        $account_code = $data->account_code;
        $outbound_caller_id_name = $data->outbound_caller_id_name;
        $outbound_caller_id_number = $data->outbound_caller_id_number;
        $effective_caller_id_name = $data->effective_caller_id_name;
        $effective_caller_id_number = $data->effective_caller_id_number;
        $emergency_caller_id_name = $data->emergency_caller_id_name;
        $emergency_caller_id_number = $data->emergency_caller_id_number;
        $max_registrations = $data->max_registrations;
        $limit_max = $data->limit_max;
        $user_record = $data->user_record;
        $domain = $data->domain;
        $context = $data->context;
        $description = $data->description;
        $extension_enabled = $data->extension_enabled;
        $extension_id = $data->extension_id;

        $check_ext = validateExtension::validate($con,$extension,$domain,$extension_id);

        if(!isset($check_ext['app'])){
            if ($extension_enabled == "true" || $extension_enabled == "false") {
                $extensions->update($con, $extension_id, $extension, $voicemail_password, $account_code, $outbound_caller_id_name, $outbound_caller_id_number, $effective_caller_id_name, $effective_caller_id_number, $emergency_caller_id_name, $emergency_caller_id_number, $max_registrations, $limit_max, $user_record, $domain, $context, $description, $extension_enabled);
            } else {
                echo json_encode([
                    "message" => "Extension Enabled Value Must be either True or False !!"
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
