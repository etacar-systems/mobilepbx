<?php
    //headers
    header('Access-Control-Allow-Origin: *');
    header('Content-Type: application/json');
    header('Access-Control-Allow-Methods: PUT');
    header('Access-Control-Allow-Headers: Access-Control-Allow-Headers,Content-Type,Access-Control-Allow-Methods,Authorization,');

    require("../../config/config.php");
    require("../../vendor/autoload.php");
    
    use Ramsey\Uuid\Uuid;

    require("dialplanoutbound.php");

    $dialplanoutbound = new DialplanOutbound();

    if (!isset($_SERVER['PHP_AUTH_USER']) || !isset($_SERVER['PHP_AUTH_PW'])){
        echo json_encode([
            "message" => "Authentication Failed !!"
        ]);
        return;
    } else {
        $username = $_SERVER['PHP_AUTH_USER'];
        $password = $_SERVER['PHP_AUTH_PW'];
    }

    $check_user = $dialplanoutbound->verify_user($con, $username, $password);
    $json_response = json_decode($check_user, true);

    if ($json_response['msg'] == 'true') {
        if ($_SERVER['REQUEST_METHOD'] === 'PUT') {
            $id = $json_response['id'];
            $data = json_decode(file_get_contents("php://input"));
            
            // $name = $data->name;
            // $order = $data->order;
            // $domain = $data->domain_id;
            // $context = $data->context;
            // $description = $data->description;
            // $dialplanoutbound_enabled = $data->dialplanoutbound_enabled;
            // $dialplan_outbound_id = $data->dialplan_outbound_id;
            // $expression_detail = $data->expression_detail;
            // $gateway_id = $data->gateway_id;
            // $dialplanoutbound_prefix = $data->dialplanoutbound_prefix;


            $dialplan_outbound_id = $data->dialplan_outbound_id;

            $gateway_id = $data->gateway_id;
            $gateway_2 = $data->gateway_2;
            $gateway_3 = $data->gateway_3;
            $expression_detail = $data->expression_detail;
            //$order = 100;
    // Date :13-Aug-2023    Added by Atul
            $order = $data->order;
            $name = $data->name;
    // END 
            $domain = $data->domain_id;
            $context = $data->context;
            $description = $data->description;
            $dialplanoutbound_enabled = $data->dialplanoutbound_enabled;
            $dialplanoutbound_prefix = $data->dialplanoutbound_prefix;

            if ($dialplanoutbound_enabled == "true" || $dialplanoutbound_enabled == "false") {
                //$dialplanoutbound->update($con, $dialplan_outbound_id, $dialplanoutbound_prefix, $name, $order, $domain, $context, $description, $dialplanoutbound_enabled, $expression_detail, $gateway_id);

                $dialplanoutbound->delete($con,$dialplan_outbound_id,'update');

                $uuid = Uuid::uuid4();
                // Get the UUID as a string
                $uuidDialPlan = $uuid->toString();

                $dialplanoutbound->post($con, $uuidDialPlan, $gateway_id,$gateway_2, $gateway_3, $expression_detail, $dialplanoutbound_prefix, $order, $domain, $context, $description, $dialplanoutbound_enabled, $id,$name,'update');
            } else {
                echo json_encode([
                    "message" => "Dialplan Outbound Value Must be either True or False !!"
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