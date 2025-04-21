<?php
    //headers
    header('Access-Control-Allow-Origin: *');
    header('Content-Type: application/json');



    require("../../config/config.php");
    require("domain.php");

    $domain = new Domain();

    if (!isset($_SERVER['PHP_AUTH_USER']) || !isset($_SERVER['PHP_AUTH_PW'])){
        echo json_encode([
            "message" => "Authentication Failed !!"
        ]);
        return;
    } else {
        $username = $_SERVER['PHP_AUTH_USER'];
        $password = $_SERVER['PHP_AUTH_PW'];
    }

    $check_user = $domain->verify_user($con, $username, $password);
    $json_response = json_decode($check_user, true);

    if ($json_response['msg'] == 'true') {
        if (isset($_GET['name'])) {
            $result = $domain->fetch_domain_by_name($con, $_GET['name']);

            if (pg_num_rows($result) > 0 ) {
                echo json_encode([
                    'status' => 1,
                    "message" => "Domain Already Exists !!",
                ]);
                return;
            } else {
                echo json_encode([
                    'status' => 0,
                    "message" => "Domain Not Exist !!",
                ]);
                return;
            }
        } else {
            echo json_encode([
                'status' => 0,
                "message" => "Domain Name is Required !!",
            ]);
            return;
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