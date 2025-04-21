<?php
    //headers
    header('Access-Control-Allow-Origin: *');
    header('Content-Type: application/json');
    header('Access-Control-Allow-Methods: POST');
    header('Access-Control-Allow-Headers: Access-Control-Allow-Headers,Content-Type,Access-Control-Allow-Methods,Authorization,');

    require("../../config/config.php");
    require("../../vendor/autoload.php");
    
    use Ramsey\Uuid\Uuid;

    require("dialplan.php");

    $dialplan = new Dialplan();

    if (!isset($_SERVER['PHP_AUTH_USER']) || !isset($_SERVER['PHP_AUTH_PW'])){
        echo json_encode([
            "message" => "Authentication Failed !!"
        ]);
        return;
    } else {
        $username = $_SERVER['PHP_AUTH_USER'];
        $password = $_SERVER['PHP_AUTH_PW'];
    }

    $check_user = $dialplan->verify_user($con, $username, $password);
    $json_response = json_decode($check_user, true);

    if ($json_response['msg'] == 'true') {
        $id = $json_response['id'];
        $data = json_decode(file_get_contents("php://input"));

        $name = $data->name;
        $extension = $data->number;
        $order = $data->order;
        $domain = $data->domain_id;
        $context = $data->context;
        $description = $data->description;
        $dialplan_enabled = $data->dialplan_enabled;
        
        $uuid = Uuid::uuid4();
        // Get the UUID as a string
        $uuidDialPlan = $uuid->toString();

        if ($dialplan_enabled == "true" || $dialplan_enabled == "false") {
            $dialplan->post($con, $uuidDialPlan, $name, $extension, $order, $domain, $context, $description, $dialplan_enabled, $id);
        } else {
            echo json_encode([
                "message" => "Dialplan Enabled Value Must be either True or False !!"
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