<?php
    //headers
    header('Access-Control-Allow-Origin: *');
    header('Content-Type: application/json');
    header('Access-Control-Allow-Methods: PUT');
    header('Access-Control-Allow-Headers: Access-Control-Allow-Headers,Content-Type,Access-Control-Allow-Methods,Authorization,');

    require("../../config/config.php");
    require("../../vendor/autoload.php");
    
    use Ramsey\Uuid\Uuid;

    require("extension.php");

    $extension = new Extension();

    if (!isset($_SERVER['PHP_AUTH_USER']) || !isset($_SERVER['PHP_AUTH_PW'])){
        echo json_encode([
            "message" => "Authentication Failed !!"
        ]);
        return;
    } else {
        $username = $_SERVER['PHP_AUTH_USER'];
        $password = $_SERVER['PHP_AUTH_PW'];
    }

    $check_user = $extension->verify_user($con, $username, $password);
    $json_response = json_decode($check_user, true); 

    if ($json_response['msg'] == 'true') {
        if ($_SERVER['REQUEST_METHOD'] === 'PUT') {
            $data = json_decode(file_get_contents("php://input"));
            
            $call_forward_enabled = $data->call_forward_enabled;
            $call_forward_destination = $data->call_forward_destination;
            $on_busy_enabled = $data->on_busy_enabled;
            $on_busy_destination = $data->on_busy_destination;
            $on_answer_enabled = $data->on_answer_enabled;
            $on_answer_destination = $data->on_answer_destination;
            $not_register_enabled = $data->not_register_enabled;
            $not_register_destination = $data->not_register_destination;
            $do_not_disturb_enabled = $data->do_not_disturb_enabled;
            $extension_id = $data->extension_id;

            $extension->update_call_forward($con, $extension_id, $call_forward_enabled, $call_forward_destination, $on_busy_enabled, $on_busy_destination, $on_answer_enabled, $on_answer_destination, $not_register_enabled, $not_register_destination, $do_not_disturb_enabled);
        } else {
            echo json_encode([
                "message" => "Invalid Method !!"
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