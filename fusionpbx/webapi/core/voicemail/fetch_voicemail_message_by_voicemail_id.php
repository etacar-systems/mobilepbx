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

            $result = $voicemail->fetch_messages_by_id($con, $_GET['id']);

            if (pg_num_rows($result) > 0 ) {

                $arr = array();
                while ($row = pg_fetch_assoc($result)) {
                    $timestamp = $row["created_epoch"];
                    $utcDateTime = new DateTime('@' . $timestamp);
                    $australiaTimeZone = new DateTimeZone('Australia/Melbourne');
                    $localDateTime = $utcDateTime->setTimezone($australiaTimeZone);
                    $formattedDate = $localDateTime->format('Y/M/d');
                    $date_custom = $localDateTime->format('d-M-Y');
                    $row['greeting_url'] = "https://api.voipaustralia.au/app/allrecordings/recordings/".$row['domain_name']."/archive/".$formattedDate."/".$row['voicemail_message_uuid'].".wav";
                    $row['date_custom'] = $date_custom;
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

