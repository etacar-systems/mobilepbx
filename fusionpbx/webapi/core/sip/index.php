<?php
    //headers
    header('Access-Control-Allow-Origin: *');
    header('Content-Type: application/json');

    require("../../config/config.php");
    require("sip.php");

    $sip = new Sip();

    if (!isset($_SERVER['PHP_AUTH_USER']) || !isset($_SERVER['PHP_AUTH_PW'])){
        echo json_encode([
            "message" => "Authentication Failed !!"
        ]);
        return;
    } else {
        $username = $_SERVER['PHP_AUTH_USER'];
        $password = $_SERVER['PHP_AUTH_PW'];
    }

    $check_user = $sip->verify_user($con, $username, $password);
    if ($check_user == 'true') {
        $result = $sip->fetch($con);

        if (pg_num_rows($result) > 0 ) {

            $arr = array();
            while ($row = pg_fetch_assoc($result)) {
                $arr[] = $row;
            }

            echo json_encode($arr);
        } else {
            echo json_encode(["message" => "No SIP Record Found !!"]);
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