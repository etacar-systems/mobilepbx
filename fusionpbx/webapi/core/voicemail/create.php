<?php
    //headers
    header('Access-Control-Allow-Origin: *');
    header('Content-Type: application/json');
    header('Access-Control-Allow-Methods: POST');
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
        // $id = $json_response['id'];
        
        $data = json_decode(file_get_contents("php://input"));
        
        $id = $data->user_id;
        $voicemail_id = $data->voicemail_id;
        $voicemail_password = $data->voicemail_password;
        $domain = $data->domain;
        $alternate_greeting_id = $data->alternate_greeting_id;
        $recording_instructions = $data->recording_instructions;
        $recording_options = $data->recording_options;
        $sent_voicemail_to = $data->sent_voicemail_to;
        $description = $data->description;
        $voicemail_enabled = $data->voicemail_enabled;

        $uuid = Uuid::uuid4();
        // Get the UUID as a string
        $uuidVoiceMail = $uuid->toString();

        if ($voicemail_enabled == "true" || $voicemail_enabled == "false") {
            $voicemail->post($con, $voicemail_id, $voicemail_password, $domain, $alternate_greeting_id, $recording_instructions, $recording_options, $sent_voicemail_to, $description, $voicemail_enabled, $uuidVoiceMail, $id);
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