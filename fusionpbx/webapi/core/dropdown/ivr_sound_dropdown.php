<?php
    //headers
    header('Access-Control-Allow-Origin: *');
    header('Content-Type: application/json');



    require("../../config/config.php");
    require_once "../../../resources/classes/ringbacks.php";
    require("dropdown.php");

    $dropdown = new Dropdown();

    if (!isset($_SERVER['PHP_AUTH_USER']) || !isset($_SERVER['PHP_AUTH_PW'])){
        echo json_encode([
            "message" => "Authentication Failed !!"
        ]);
        return;
    } else {
        $username = $_SERVER['PHP_AUTH_USER'];
        $password = $_SERVER['PHP_AUTH_PW'];
    }

    $check_user = $dropdown->verify_user($con, $username, $password);
    $json_response = json_decode($check_user, true);

    if ($json_response['msg'] == 'true') {

        //$data = json_decode(file_get_contents("php://input"));

        $domain_id = $_GET['id'];

        $ring_group_ringback = '${us-ring}';

        $sound_list = [];
        
        $recordings_list = [];
        $sql3 = "select recording_uuid, recording_name, recording_filename, v_domains.domain_name ";
        $sql3 .= "from v_recordings ";
        $sql3 .= " JOIN public.v_domains ";
        $sql3 .= " ON v_domains.domain_uuid = v_recordings.domain_uuid ";
        $sql3 .= "where v_recordings.domain_uuid = '$domain_id' ";
        $result3 = pg_query($con, $sql3);

        if (pg_num_rows($result3) > 0 ) {

            while ($row = pg_fetch_assoc($result3)) {
                
                //$recordings_list['/var/lib/freeswitch/recordings/'.$row['domain_name']."/".$row['recording_filename']] = $row['recording_filename'];
        	  $recordings_list[$row['recording_name']] = $row['recording_filename']; 
	 }
            
        }
	else 
	{
		$recordings_list = new ArrayObject();
	}
    $sound_list = [
        'ivr/ivr-that_was_an_invalid_entry.wav	' => 'invalid-sound',
        'ivr/ivr-send_to_voicemail.wav' => 'ivr-send-to-voicemail',
        'ivr/ivr-repeat_this_information.wav' => 'ivr-repeat_this_information'
    ];

     //echo json_encode(array('recordings'=>$recordings_list,'ringtones'=>$ringtones_list,'Tones'=>$tone_list));
     echo json_encode(array('recordings'=>$recordings_list,'sounds'=>$sound_list));
    } else {
        header('WWW-Authenticate: Basic realm="My Realm"');
        header('HTTP/1.0 401 Unauthorized');
        echo json_encode([
            "message" => "Authentication Failed !!"
        ]);
        exit;
    
    }
?>
