<?php
    //headers
    header('Access-Control-Allow-Origin: *');
    header('Content-Type: application/json');
    header('Access-Control-Allow-Methods: PUT');
    header('Access-Control-Allow-Headers: Access-Control-Allow-Headers,Content-Type,Access-Control-Allow-Methods,Authorization,');

    require("../../config/config.php");
    require("../../vendor/autoload.php");
    
    use Ramsey\Uuid\Uuid;

    require("pbxqueues.php");

    $pbxqueues = new PbxQueues();

    if (!isset($_SERVER['PHP_AUTH_USER']) || !isset($_SERVER['PHP_AUTH_PW'])){
        echo json_encode([
            "message" => "Authentication Failed !!"
        ]);
        return;
    } else {
        $username = $_SERVER['PHP_AUTH_USER'];
        $password = $_SERVER['PHP_AUTH_PW'];
    }

    $check_user = $pbxqueues->verify_user($con, $username, $password);
    $json_response = json_decode($check_user, true);

    if ($json_response['msg'] == 'true') {
        if ($_SERVER['REQUEST_METHOD'] === 'PUT') {
            $data = json_decode(file_get_contents("php://input"));
            
            $name = $data->name;
            $extension = $data->extension;
            $order = $data->order;
            $domain = $data->domain_id;
            $context = $data->context;
            $description = $data->description;
            $pbxqueues_enabled = $data->pbxqueues_enabled;
            $queue_id = $data->queue_id;

            if ($pbxqueues_enabled == "true" || $pbxqueues_enabled == "false") {
                $pbxqueues->update($con, $queue_id, $name, $extension, $order, $domain, $context, $description, $pbxqueues_enabled);
            } else {
                echo json_encode([
                    "message" => "Queue Enabled Value Must be either True or False !!"
                ]);
            }
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