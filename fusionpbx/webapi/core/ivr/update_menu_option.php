<?php
    //headers
    header('Access-Control-Allow-Origin: *');
    header('Content-Type: application/json');
    header('Access-Control-Allow-Methods: PUT');
    header('Access-Control-Allow-Headers: Access-Control-Allow-Headers,Content-Type,Access-Control-Allow-Methods,Authorization,');

    require("../../config/config.php");
    require("../../vendor/autoload.php");
    
    use Ramsey\Uuid\Uuid;

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
        if ($_SERVER['REQUEST_METHOD'] === 'PUT') {
            $data = json_decode(file_get_contents("php://input"));

            $domain = $data->domain_id;
            $menu_digit = $data->menu_digit;
            $menu_option = $data->menu_option;
            $menu_param = $data->menu_param;
            $menu_order = $data->menu_order;
            $ivr_menu_enabled = $data->ivr_menu_enabled;
            $ivr_menu_id = $data->ivr_menu_id;
            
            if ($ivr_menu_enabled == "true" || $ivr_menu_enabled == "false") {
                $ivr->updateMenuOption($con, $ivr_menu_id, $domain, $menu_digit, $menu_option, $menu_param, $menu_order, $ivr_menu_enabled);
            } else {
                echo json_encode([
                    "message" => "IVR Menu Enabled Value Must be either True or False !!"
                ]);
            }
        } else {
            echo json_encode([
                "message" => "Invalid Request !!"
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