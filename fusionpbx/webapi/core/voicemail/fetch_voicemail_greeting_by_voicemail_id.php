<?php
    //headers
    header('Access-Control-Allow-Origin: *');
    header('Content-Type: application/json');

    require("../../config/config.php");
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
        if (isset($_GET['id'])) {

            $result = $voicemail->fetch_greetings_by_voicemail_id($con, $_GET['id']);

            if (pg_num_rows($result) > 0 ) {

                $arr = array();
                while ($row = pg_fetch_assoc($result)) {
                    $row['greeting_url'] = "https://api.voipaustralia.au/ext_storage/voicemails/voicemail/".$row['greeting_filename'];
                    $arr[] = $row;
                }

                echo json_encode($arr);
            } else {
                echo json_encode(["message" => "No Voicemail Found !!", 'total_rows' => 0]);
            }
        } else {
            echo json_encode(["message" => "Invalid Voicemail ID !!", 'total_rows' => 0]);
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

https://api.voipaustralia.au/webapi/core/voicemail/fetch_voicemail_greeting_by_voicemail_id.php?id=5a17ead5-56ce-4869-a7b5-c0871e53d5f3
https://api.voipaustralia.au/webapi/core/voicemail/fetch_voicemail_greeting_by_voicemail_id.php?id=c7abd90d-2a9c-4bad-962a-ede40d09d073
https://api.voipaustralia.au/webapi/core/voicemail/fetch_voicemail_greeting_by_voicemail_id.php?id=cf57ce1a-e4fa-4787-b82a-82e96035d6b9
