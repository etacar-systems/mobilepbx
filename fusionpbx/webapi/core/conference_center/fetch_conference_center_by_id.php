<?php
   // Date :27-10-2024 Added by Atul for fetch by id conference-room and center
    //headers
    header('Access-Control-Allow-Origin: *');
    header('Content-Type: application/json');

    require("../../config/config.php");
    require("conference_center.php");

    $conferenceCenter = new ConferenceCenter();

    if (!isset($_SERVER['PHP_AUTH_USER']) || !isset($_SERVER['PHP_AUTH_PW'])){
        echo json_encode([
            "message" => "Authentication Failed !!"
        ]);
        return;
    } else {
        $username = $_SERVER['PHP_AUTH_USER'];
        $password = $_SERVER['PHP_AUTH_PW'];
    }

    $check_user = $conferenceCenter->verify_user($con, $username, $password);
    $json_response = json_decode($check_user, true);

    if ($json_response['msg'] == 'true') {
        if (isset($_GET['id'])) {
            $result = $conferenceCenter->fetch_by_id($con, $_GET['id']);

            if (pg_num_rows($result) > 0 ) {

                $arr = array();
                while ($row = pg_fetch_assoc($result)) {
                    $arr[] = $row;
                }

                echo json_encode($arr);
            } else {
                echo json_encode(["message" => "No Conference Center Found !!"]);
            }
        } else {
            echo json_encode(
                [
                    "message" => "Invalid Conference Center ID !!"
                ]
            );
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
