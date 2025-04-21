<?php
    //headers
    header('Access-Control-Allow-Origin: *');
    header('Content-Type: application/json');
    header('Access-Control-Allow-Methods: PUT');
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
        $device_enabled = $data->device_enabled;
        $device_address = $data->device_address;
        $device_label = $data->device_label;
        $device_vendor = $data->device_vendor;
        $device_template = $data->device_template;
        $device_description = $data->device_description;
        $device_userid = $data->device_userid;
        $device_id = $data->device_id;

        if ($device_enabled == 'true' || $device_enabled == 'false') {
            $device->update_device($con, $device_id, $device_enabled, $device_address, $device_label, $device_vendor, $device_template, $device_description, $device_userid);
        } else {
            echo json_encode([
                "message" => "Device Enabled Value Must be Either True or False !!"
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