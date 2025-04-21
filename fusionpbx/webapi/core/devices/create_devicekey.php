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
        $id = $json_response['id'];

        $data = json_decode(file_get_contents("php://input"));
        
        $domain_name = $data->domain;
        $device_id = $data->device_id;
        $device_key_id = $data->device_key_id;
        $device_key_category = $data->device_key_category;
        $device_key_vendor = $data->device_key_vendor;
        $device_key_type = $data->device_key_type;
        $device_key_line = $data->device_key_line;
        $device_key_value = $data->device_key_value;
        $device_key_label = $data->device_key_label;

        $uuid = Uuid::uuid4();
        // Get the UUID as a string
        $uuidString = $uuid->toString();

        $device->post_devicekey($con, $uuidString, $device_id, $domain_name, $device_key_id, $device_key_category, $device_key_vendor, $device_key_type, $device_key_line, $device_key_value, $device_key_label, $id);
    } else {
        header('WWW-Authenticate: Basic realm="My Realm"');
        header('HTTP/1.0 401 Unauthorized');
        echo json_encode([
            "message" => "Authentication Failed !!"
        ]);
        exit;
    }
?>