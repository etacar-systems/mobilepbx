<?php
    //headers
    header('Access-Control-Allow-Origin: *');
    header('Content-Type: application/json');
    header('Access-Control-Allow-Methods: POST');
    header('Access-Control-Allow-Headers: Access-Control-Allow-Headers,Content-Type,Access-Control-Allow-Methods,Authorization,');

    require("../../config/config.php");
    require("../../vendor/autoload.php");
    
    use Ramsey\Uuid\Uuid;

    require("gateway.php");
    $gateway = new Gateway();

    if (!isset($_SERVER['PHP_AUTH_USER']) || !isset($_SERVER['PHP_AUTH_PW'])){
        echo json_encode([
            "message" => "Authentication Failed !!"
        ]);
        return;
    } else {
        $username = $_SERVER['PHP_AUTH_USER'];
        $password = $_SERVER['PHP_AUTH_PW'];
    }

    $check_user = $gateway->verify_user($con, $username, $password);
    $json_response = json_decode($check_user, true);

    if ($json_response['msg'] == 'true') {
        $id = $json_response['id'];

        $data = json_decode(file_get_contents("php://input"));
        $gateway_name = $data->gateway_name;
        $domain_id = $data->domain_id;
        $username = $data->username;
        $password = $data->password;
        $realm = $data->realm;
        $from_user = $data->from_user;
        $proxy = $data->proxy;
        $expire_seconds = $data->expire_seconds;
        $register = $data->register;
        $retry_seconds = $data->retry_seconds;
        $profile = $data->profile;
        $gateway_enabled = $data->gateway_enabled;
        $context = $data->context;
        $description = $data->description;
        $caller_id_in_from = $data->caller_id_in_from;
        $register_transport = $data->transport;

        $uuid = Uuid::uuid4();
        // Get the UUID as a string
        $uuidString = $uuid->toString();
        if ($gateway_enabled == 'true' || $gateway_enabled == 'false') {
            $gateway->post($con, $uuidString, $domain_id, $gateway_name, $username, $password, $realm, $from_user, $proxy, $expire_seconds, $register, $retry_seconds, $profile, $gateway_enabled, $context, $description, $id, $caller_id_in_from, $register_transport);
        } else {
            echo json_encode([
                "message" => "Gateway Enabled Value Must be Either True or False !!"
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
