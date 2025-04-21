<?php
    //headers
    header('Access-Control-Allow-Origin: *');
    header('Content-Type: application/json');
    header('Access-Control-Allow-Methods: PUT');
    header('Access-Control-Allow-Headers: Access-Control-Allow-Headers,Content-Type,Access-Control-Allow-Methods,Authorization,');

    require("../../config/config.php");
    require("../../vendor/autoload.php");
    
    use Ramsey\Uuid\Uuid;

    require("voicemail.php");

    $voicemail = new Voicemail();

    if (!isset($_SERVER['PHP_AUTH_USER']) || !isset($_SERVER['PHP_AUTH_PW'])){
        echo json_encode([
            "message" => "Authentication Failed !!"
        ]);
        return;
    } else {
        $username = $_SERVER['PHP_AUTH_USER'];
        $password = $_SERVER['PHP_AUTH_PW'];
    }

    $check_user = $voicemail->verify_user($con, $username, $password);
    $json_response = json_decode($check_user, true);

    if ($json_response['msg'] == 'true') {
        $data = json_decode(file_get_contents("php://input"));

        $voicemail_password = $data->voicemail_password;
        $description = $data->description;
        $voicemail_enabled = $data->voicemail_enabled;
        $voicemail_uuid = $data->voicemail_uuid;

        if ($voicemail_enabled == "true" || $voicemail_enabled == "false") {
            $voicemail->update($con, $voicemail_password, $description, $voicemail_enabled, $voicemail_uuid);
        } else {
            echo json_encode([
                "message" => "Voicemail Enabled Value Must be either True or False !!"
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