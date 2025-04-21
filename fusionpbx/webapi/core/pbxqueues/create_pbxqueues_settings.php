<?php
    //headers
    header('Access-Control-Allow-Origin: *');
    header('Content-Type: application/json');
    header('Access-Control-Allow-Methods: POST');
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
        $id = $json_response['id'];
        $data = json_decode(file_get_contents("php://input"));

        $domain = $data->domain_id;
        $dialplan_id = $data->dialplan_id;
        $dialplan_detail_tag = $data->dialplan_detail_tag;
        $dialplan_detail_type = $data->dialplan_detail_type;
        $dialplan_detail_data = $data->dialplan_detail_data;
        $dialplan_detail_break = $data->dialplan_detail_break;
        $dialplan_detail_group = $data->dialplan_detail_group;
        $dialplan_detail_order = $data->dialplan_detail_order;
        
        $uuid = Uuid::uuid4();
        // Get the UUID as a string
        $uuidSetting = $uuid->toString();

        $pbxqueues->postQueueSettings($con, $uuidSetting, $dialplan_id, $domain, $dialplan_detail_tag, $dialplan_detail_type, $dialplan_detail_data, $dialplan_detail_break, $dialplan_detail_group, $dialplan_detail_order, $id);
       
    } else {
        header('WWW-Authenticate: Basic realm="My Realm"');
        header('HTTP/1.0 401 Unauthorized');
        echo json_encode([
            "message" => "Authentication Failed !!"
        ]);
        exit;
    }
?>