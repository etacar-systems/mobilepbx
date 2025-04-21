<?php
    //headers
    header('Access-Control-Allow-Origin: *');
    header('Content-Type: application/json');
    header('Access-Control-Allow-Methods: POST');
    header('Access-Control-Allow-Headers: Access-Control-Allow-Headers,Content-Type,Access-Control-Allow-Methods,Authorization,');

    require("../../config/config.php");
    require("../../vendor/autoload.php");
    
    use Ramsey\Uuid\Uuid;

    require("firewall.php");
    $firewall = new Firewall();

    if (!isset($_SERVER['PHP_AUTH_USER']) || !isset($_SERVER['PHP_AUTH_PW'])){
        echo json_encode([
            "message" => "Authentication Failed !!"
        ]);
        return;
    } else {
        $username = $_SERVER['PHP_AUTH_USER'];
        $password = $_SERVER['PHP_AUTH_PW'];
    }

    $check_user = $firewall->verify_user($con, $username, $password);
    $json_response = json_decode($check_user, true);

    if ($json_response['msg'] == 'true') {
        $id = $json_response['id'];

        $data = json_decode(file_get_contents("php://input"));
        $access_control_name = $data->access_control_name;
        $access_control_default = $data->access_control_default;
        $access_control_description = $data->access_control_description;
        $access_control_nodes = $data->access_control_nodes;

        if ($access_control_name == 'providers' || $access_control_name == 'domains') {
            $access_control_default = 'deny';
        }
        if ($access_control_default != 'allow' && $access_control_default != 'deny') {
            $access_control_default = 'deny';
        }


        $uuid = Uuid::uuid4();
        // Get the UUID as a string
        $uuidString = $uuid->toString();
        $firewall->post($con, $uuidString, $access_control_name, $access_control_default, $access_control_description, $access_control_nodes,$id);
        
    } else {
        header('WWW-Authenticate: Basic realm="My Realm"');
        header('HTTP/1.0 401 Unauthorized');
        echo json_encode([
            "message" => "Authentication Failed !!"
        ]);
        exit;
    
    }
?>