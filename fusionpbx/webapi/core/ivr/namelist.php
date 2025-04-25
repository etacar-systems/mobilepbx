<?php
    //headers
    header('Access-Control-Allow-Origin: *');
    header('Content-Type: application/json');



    require("../../config/config.php");
    require("ivr.php");

    $ivr = new IVR();

    if (!isset($_SERVER['PHP_AUTH_USER']) || !isset($_SERVER['PHP_AUTH_PW'])){
        echo json_encode([
            "message" => "Authentication Failed !!"
        ]);
        return;
    } else {
        $username = $_SERVER['PHP_AUTH_USER'];
        $password = $_SERVER['PHP_AUTH_PW'];
    }

    $check_user = $ivr->verify_user($con, $username, $password);
    $json_response = json_decode($check_user, true);

    if ($json_response['msg'] == 'true') {

        $data = json_decode(file_get_contents("php://input"));

        if (isset($data->domain_id)) {

            $result = $ivr->fetch_namelist($con, $data->domain_id);

            echo json_encode($result);
        }else {
            echo json_encode(["message" => "No domain id found !!"]);
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
