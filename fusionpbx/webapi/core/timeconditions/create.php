<?php
    //headers
    header('Access-Control-Allow-Origin: *');
    header('Content-Type: application/json');
    header('Access-Control-Allow-Methods: POST');
    header('Access-Control-Allow-Headers: Access-Control-Allow-Headers,Content-Type,Access-Control-Allow-Methods,Authorization,');

    require("../../config/config.php");
    require("../../vendor/autoload.php");
    require("../classes/validateExtension.php");
    
    use Ramsey\Uuid\Uuid;

    require("timecondition.php");

    $timeCondition = new timecondition();

    if (!isset($_SERVER['PHP_AUTH_USER']) || !isset($_SERVER['PHP_AUTH_PW'])){
        echo json_encode([
            "message" => "Authentication Failed !!"
        ]);
        return;
    } else {
        $username = $_SERVER['PHP_AUTH_USER'];
        $password = $_SERVER['PHP_AUTH_PW'];
    }

    $check_user = $timeCondition->verify_user($con, $username, $password);
    $json_response = json_decode($check_user, true);

    if ($json_response['msg'] == 'true') {
        $id = $json_response['id'];
        $data = json_decode(file_get_contents("php://input"));

        $name = $data->name;
        $extension = $data->extension;
        $order = $data->order;
        $domain = $data->domain_id;
        $context = $data->context;
        $description = $data->description;
        $timecondition_enabled = $data->timecondition_enabled;

        $dialplan_action = $data->dialplan_action;
        $dialplan_anti_action = $data->dialplan_anti_action;

        $timecondition_data = $data->timecondition_data;

	if(isset($data->type) && $data->type=="2"){
       		$check_ext = validateExtension::validate($con,$extension,$domain);
        }else{
		$check_ext = validateExtension::validate_ext_dial_rule($con,$extension,$domain);
	}
        if(!isset($check_ext['app'])){
        
            $uuid = Uuid::uuid4();
            // Get the UUID as a string
            $uuidDialPlan = $uuid->toString();

            if ($timecondition_enabled == "true" || $timecondition_enabled == "false") {
                $timeCondition->post($con, $uuidDialPlan, $name, $extension, $order, $domain, $context, $description, $timecondition_enabled, $id, $timecondition_data, $dialplan_action, $dialplan_anti_action);
            } else {
                echo json_encode([
                    "message" => "Time Condition Enabled Value Must be either True or False !!"
                ]);
            }
            
        }else{
            echo json_encode([
                "message" => $check_ext['extension']." ".$check_ext['app']." alreay available !!"
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
