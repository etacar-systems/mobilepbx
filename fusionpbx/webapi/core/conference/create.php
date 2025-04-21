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
        $id = $json_response['id'];

        $data = json_decode(file_get_contents("php://input"));

        $domain_name = $data->domain;
        $name = $data->name;
        $extension = $data->extension;
        $pin_number = $data->pin_number;
        $description = $data->description;
        $conference_enabled = $data->conference_enabled;
	// Date :08-08-24 Added by Atul for conference additional field
	$conference_profile =$data->conference_profile;
	$conference_flags =$data->conference_flags;
	$conference_account_code =$data->conference_account_code;
	$conference_context =$data->conference_context;
	// END

        $record = (isset($data->record)) ? $data->record : 'false';
        $wait_mod = (isset($data->wait_mod)) ? $data->wait_mod : 'true';

        $check_ext = validateExtension::validate($con,$extension,$domain_name);

        if(!isset($check_ext['app'])){
            
            $uuid = Uuid::uuid4();
    		$uuid1= Uuid::uuid4();
            // Get the UUID as a string
            $uuidConference = $uuid->toString();
    		$dialplanuuid = $uuid1->toString();
            if ($conference_enabled == "true" || $conference_enabled == "false") {
                
             // Date :08-08-24 Added Additional field in create conference 
                //$conference->post($con, $name, $domain_name, $extension, $pin_number, $description, $conference_enabled, $uuidConference, $id,$conference_profile,$conference_flags,$conference_account_code,$conference_context,$dialplanuuid);
                //$conference->create_dialplan($con, $name, $domain_name, $extension, $pin_number, $description, $conference_enabled, $uuidConference, $id,$conference_profile,$conference_flags,$conference_account_code,$conference_context,$dialplanuuid);

                $room_uuid = Uuid::uuid4()->toString();

                $data->domain_id = $domain_name;
                $data->conference_room_name = $name;
                $data->moderator_pin = $pin_number;
                $data->participant_pin = $pin_number;
                $data->wait_mod = $wait_mod;
                $data->record = $record;
            
                $conferenceCenter->post($con, $uuidConference, $data, $id,$dialplanuuid,$room_uuid );
    	    
    	// END 
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
        header('WWW-Authenticate: Basic realm="My Realm"');
        header('HTTP/1.0 401 Unauthorized');
        echo json_encode([
            "message" => "Authentication Failed !!"
        ]);
        exit;
    }
?>
