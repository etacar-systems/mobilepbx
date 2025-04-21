<?php
    //headers
    header('Access-Control-Allow-Origin: *');
    header('Content-Type: application/json');
    header('Access-Control-Allow-Methods: PUT');
    header('Access-Control-Allow-Headers: Access-Control-Allow-Headers,Content-Type,Access-Control-Allow-Methods,Authorization,');

    require("../../config/config.php");
    require("../../vendor/autoload.php");
    
    use Ramsey\Uuid\Uuid;

    require("ringgroup.php");

    $ringGroup = new RingGroup();

    if (!isset($_SERVER['PHP_AUTH_USER']) || !isset($_SERVER['PHP_AUTH_PW'])){
        echo json_encode([
            "message" => "Authentication Failed !!"
        ]);
        return;
    } else {
        $username = $_SERVER['PHP_AUTH_USER'];
        $password = $_SERVER['PHP_AUTH_PW'];
    }

    $check_user = $ringGroup->verify_user($con, $username, $password);
    $json_response = json_decode($check_user, true);

    if ($json_response['msg'] == 'true') {
        if ($_SERVER['REQUEST_METHOD'] === 'PUT') {
            $data = json_decode(file_get_contents("php://input"));

            $destination_number = $data->destination_number;
            $destination_delay = $data->destination_delay;
            $destination_timeout = $data->destination_timeout;
            $domain = $data->domain_id;
            $ringGroupDestination_enabled = $data->destination_enabled;
            $ring_group_destination_id = $data->ring_group_destination_id;
            

            if ($ringGroupDestination_enabled == "true" || $ringGroupDestination_enabled == "false") {
                $ringGroup->updateDestination($con, $ring_group_destination_id, $domain, $destination_number, $destination_delay, $destination_timeout, $ringGroupDestination_enabled);
            } else {
                echo json_encode([
                    "message" => "Ring Group Destination Enabled Value Must be either True or False !!"
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