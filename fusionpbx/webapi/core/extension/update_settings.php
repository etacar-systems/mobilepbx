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

        $email = $data->email;
        $voicemail_enabled = $data->voicemail_enabled;
        $voicemail_timeout = $data->voicemail_timeout;
        $extension = $data->extension;
        $extension_id = $data->extension_id;
        $domain_id = $data->domain_id;

        
        $extensions->updateSettings($con, $extension, $email, $voicemail_enabled, $voicemail_timeout, $domain_id, $extension_id);             

        
    } else {
        header('WWW-Authenticate: Basic realm="My Realm"');
        header('HTTP/1.0 401 Unauthorized');
        echo json_encode([
            "message" => "Authentication Failed !!"
        ]);
        exit;
    }
?>