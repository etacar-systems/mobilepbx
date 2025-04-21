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

        $ringtones_list = [];
        $tone_list = [];
        $recordings_list = [];


        $sql = "select * from v_vars ";
        $sql .= "where var_category = 'Ringtones' ";
        $sql .= "order by var_name asc ";

        $result = pg_query($con, $sql);

        if (pg_num_rows($result) > 0 ) {

            $arr = array();
            while ($row = pg_fetch_assoc($result)) {
                $arr[] = $row;

                $ringtone = $row['var_name'];
                
                $label = $ringtone;
                $ringtones_list['${'.$ringtone.'}'] = $label;
            }

        }

        $sql2 = "select * from v_vars ";
        $sql2 .= "where var_category = 'Tones' ";
        $sql2 .= "order by var_name asc ";

        $result2 = pg_query($con, $sql2);

        if (pg_num_rows($result2) > 0 ) {

            while ($row = pg_fetch_assoc($result2)) {
                
                $tone = $row['var_name'];
                
                $label = $tone;
                $tone_list['${'.$tone.'}'] = $label;
            }

            
        }

        $sql3 = "select recording_uuid, recording_filename, v_domains.domain_name ";
        $sql3 .= "from v_recordings ";
        $sql3 .= " JOIN public.v_domains ";
        $sql3 .= " ON v_domains.domain_uuid = v_recordings.domain_uuid ";
        $sql3 .= "where v_recordings.domain_uuid = '$domain_id' ";
        $result3 = pg_query($con, $sql3);

        if (pg_num_rows($result3) > 0 ) {

            while ($row = pg_fetch_assoc($result3)) {
                
                $recordings_list['/var/lib/freeswitch/recordings/'.$row['domain_name']."/".$row['recording_filename']] = $row['recording_filename'];
        	   
	 }
            
        }
	else 
	{
		$recordings_list = new ArrayObject();
	}
     

     echo json_encode(array('recordings'=>$recordings_list,'ringtones'=>$ringtones_list,'Tones'=>$tone_list));
     //echo json_encode(array('recordings'=>$sql3,'ringtones'=>$ringtones_list,'Tones'=>$tone_list));
        
    } else {
        header('WWW-Authenticate: Basic realm="My Realm"');
        header('HTTP/1.0 401 Unauthorized');
        echo json_encode([
            "message" => "Authentication Failed !!"
        ]);
        exit;
    
    }
?>
