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

    require("../conference_center/conference_center.php");
    $conferenceCenter = new ConferenceCenter();

    // require("conference.php");

    // $conference = new Conference();

    if (!isset($_SERVER['PHP_AUTH_USER']) || !isset($_SERVER['PHP_AUTH_PW'])){
        echo json_encode([
            "message" => "Authentication Failed !!"
        ]);
        return;
    } else {
        $username = $_SERVER['PHP_AUTH_USER'];
        $password = $_SERVER['PHP_AUTH_PW'];
    }

    $check_user = $conferenceCenter->verify_user($con, $username, $password);
    $json_response = json_decode($check_user, true);

    if ($json_response['msg'] == 'true') {
        if ($_SERVER['REQUEST_METHOD'] === 'PUT') {
            $id = $json_response['id'];
            $data = json_decode(file_get_contents("php://input"));

            $name = $data->name;
            $extension = $data->extension;
            $pin_number = $data->pin_number;
            $description = $data->description;
            $conference_enabled = $data->conference_enabled;
            $conference_id = $data->conference_id;
            $domain = $data->domain;
			// Date :08-08-24 Added by Atul for conference additional field
			$conference_profile =$data->conference_profile;
			$conference_flags =$data->conference_flags;
			$conference_account_code =$data->conference_account_code;
			$conference_context =$data->conference_context;
			// END

            $record = (isset($data->record)) ? $data->record : 'false';
            $wait_mod = (isset($data->wait_mod)) ? $data->wait_mod : 'true';

            $check_ext = validateExtension::validate($con,$extension,$domain,$conference_id);

            if(!isset($check_ext['app'])){

                if ($conference_enabled == "true" || $conference_enabled == "false") {
                    //$conference->update($con, $name, $extension, $pin_number, $description, $conference_enabled, $conference_id);
    				// Date :-08-08-2024 Added by Atul for conference additional field.
    				//$conference->update($con, $name, $extension, $pin_number, $description, $conference_enabled, $conference_id,$conference_profile,$conference_flags,$conference_account_code,$conference_context,$domain);
    				//$conference->update_dialplan($con, $name, $extension, $pin_number, $description, $conference_enabled, $conference_id,$conference_profile,$conference_flags,$conference_account_code,$conference_context,$domain);

                    $data->domain_id = $domain;
                    $data->conference_room_name = $name;
                    $data->moderator_pin = $pin_number;
                    $data->participant_pin = $pin_number;
                    $data->wait_mod = $wait_mod;
                    $data->record = $record;
                    $data->conference_center_id = $conference_id;
                
                    $conferenceCenter->update($con, $data, $id);

    			
    			} else {
                    echo json_encode([
                        "message" => "Conference Enabled Value Must be either True or False !!"
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
