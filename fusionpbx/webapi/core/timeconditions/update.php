<?php
    //headers
    header('Access-Control-Allow-Origin: *');
    header('Content-Type: application/json');
    header('Access-Control-Allow-Methods: PUT');
    header('Access-Control-Allow-Headers: Access-Control-Allow-Headers,Content-Type,Access-Control-Allow-Methods,Authorization,');

    require("../../config/config.php");
    require("../../vendor/autoload.php");
    require("../classes/validateExtension.php");
    
    use Ramsey\Uuid\Uuid;

    require("timecondition.php");

    $timecondition = new TimeCondition();

    if (!isset($_SERVER['PHP_AUTH_USER']) || !isset($_SERVER['PHP_AUTH_PW'])){
        echo json_encode([
            "message" => "Authentication Failed !!"
        ]);
        return;
    } else {
        $username = $_SERVER['PHP_AUTH_USER'];
        $password = $_SERVER['PHP_AUTH_PW'];
    }

    $check_user = $timecondition->verify_user($con, $username, $password);
    $json_response = json_decode($check_user, true);

    if ($json_response['msg'] == 'true') {
        if ($_SERVER['REQUEST_METHOD'] === 'PUT') {

            $id = $json_response['id'];

            $data = json_decode(file_get_contents("php://input"));
            
            $name = $data->name;
            $extension = $data->extension;
            $order = $data->order;
            $domain = $data->domain_id;
            $context = $data->context;
            $description = $data->description;
            $timecondition_enabled = $data->timecondition_enabled;
            $timecondition_id = $data->timecondition_id;

            $dialplan_action = $data->dialplan_action;
            $dialplan_anti_action = $data->dialplan_anti_action;

            $timecondition_data = $data->timecondition_data;

            if(isset($data->type) && $data->type=="2"){
                $check_ext = validateExtension::validate($con,$extension,$domain,$timecondition_id);
            }else{
                $check_ext = validateExtension::validate_ext_dial_rule($con,$extension,$domain,$timecondition_id);
            }
            #$check_ext = validateExtension::validate($con,$extension,$domain,$timecondition_id);
            #$check_ext = validateExtension::validate_ext_dial_rule($con,$extension,$domain,$timecondition_id);

            if(!isset($check_ext['app'])){

                if ($timecondition_enabled == "true" || $timecondition_enabled == "false") {
                    $timecondition->update($con, $timecondition_id, $name, $extension, $order, $domain, $context, $description, $timecondition_enabled,$timecondition_data, $dialplan_action, $dialplan_anti_action,$id);
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
