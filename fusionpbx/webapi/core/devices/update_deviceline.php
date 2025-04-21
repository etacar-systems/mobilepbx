<?php
    //headers
    header('Access-Control-Allow-Origin: *');
    header('Content-Type: application/json');
    header('Access-Control-Allow-Methods: POST');
    header('Access-Control-Allow-Headers: Access-Control-Allow-Headers,Content-Type,Access-Control-Allow-Methods,Authorization,');

    require("../../config/config.php");
    require("../../vendor/autoload.php");
    
    use Ramsey\Uuid\Uuid;

    require("device.php");
    $device = new Device();

    if (!isset($_SERVER['PHP_AUTH_USER']) || !isset($_SERVER['PHP_AUTH_PW'])){
        echo json_encode([
            "message" => "Authentication Failed !!"
        ]);
        return;
    } else {
        $username = $_SERVER['PHP_AUTH_USER'];
        $password = $_SERVER['PHP_AUTH_PW'];
    }

    $check_user = $device->verify_user($con, $username, $password);
    $json_response = json_decode($check_user, true);

    if ($json_response['msg'] == 'true') {
        $data = json_decode(file_get_contents("php://input"));
        $device_linenumber = $data->device_linenumber;
        $device_server_address = $data->device_server_address;
        $device_line_label = $data->device_line_label;
        $device_line_displayname = $data->device_line_displayname;
        $device_line_userid = $data->device_line_userid;
        $device_line_user_auth = $data->device_line_user_auth;
        $device_line_user_password = $data->device_line_user_password;
        $device_line_port = $data->device_line_port;
        $device_line_transport = $data->device_line_transport;
        $device_line_register_expire = $data->device_line_register_expire;
        $device_line_shared_line = $data->device_line_shared_line;
        $device_line_id = $data->device_line_id;

        $device->update_device_line($con, $device_line_id, $device_linenumber, $device_server_address, $device_line_label, $device_line_displayname, $device_line_userid, $device_line_user_auth, $device_line_user_password, $device_line_port, $device_line_transport, $device_line_register_expire, $device_line_shared_line);
        
    } else {
        header('WWW-Authenticate: Basic realm="My Realm"');
        header('HTTP/1.0 401 Unauthorized');
        echo json_encode([
            "message" => "Authentication Failed !!"
        ]);
        exit;
    }
?>