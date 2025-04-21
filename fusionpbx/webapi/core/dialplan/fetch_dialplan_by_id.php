<?php
    //headers
    header('Access-Control-Allow-Origin: *');
    header('Content-Type: application/json');

    require("../../config/config.php");
    require("dialplan.php");

    $dialplan = new Dialplan();

    if (!isset($_SERVER['PHP_AUTH_USER']) || !isset($_SERVER['PHP_AUTH_PW'])){
        echo json_encode([
            "message" => "Authentication Failed !!"
        ]);
        return;
    } else {
        $username = $_SERVER['PHP_AUTH_USER'];
        $password = $_SERVER['PHP_AUTH_PW'];
    }

    $check_user = $dialplan->verify_user($con, $username, $password);
    if ($check_user == 'true') {
        if (isset($_GET['id'])) {

            $result = $dialplan->fetch_by_id($con, $_GET['id']);

            if (pg_num_rows($result) > 0 ) {

                $arr = array();
                while ($row = pg_fetch_assoc($result)) {
                    $arr[] = $row;
                }

                echo json_encode($arr);
            } else {
                echo json_encode(["message" => "No Dialplan Found !!"]);
            }
        } else {
            echo json_encode(["message" => "No Dialplan Found !!"]);
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