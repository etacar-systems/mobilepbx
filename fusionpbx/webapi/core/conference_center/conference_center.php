<?php
   // Date : 26-10-2024 Added by Atul for conference center
    require("../../config/config.php");
    require("../classes/SocketConnection.php");
    use Ramsey\Uuid\Uuid;

    class ConferenceCenter {

        public function verify_user($con, $username, $password) {
            $query = "SELECT * FROM public.v_users WHERE username = '$username'";
            $result = pg_query($con,$query);
            $admin = pg_fetch_array($result);
        
            if (!empty($admin)) {
                if (password_verify($password, $admin['password'])) {
                    $data = json_encode([
                        'msg' => 'true',
                        'id' => $admin['user_uuid']
                    ]);
                    return $data;
                } else {
                    $data = json_encode([
                        'msg' => 'false',
                    ]);
                    return $data;   
                }
                
            } else {
                $data = json_encode([
                    'msg' => 'false',
                ]);
                return $data;
            }
        }

        public function fetch($con) {
            $query = 'SELECT * FROM public.v_conference_centers 
            JOIN public.v_domains ON v_domains.domain_uuid = v_conference_centers.domain_uuid  
            JOIN public.v_conference_rooms ON v_conference_centers.conference_center_uuid = v_conference_rooms.conference_center_uuid ' ;
            $result = pg_query($con, $query);
            return $result;
        }

        public function fetch_by_id($con, $id) {
            $query = "SELECT * FROM public.v_conference_centers
            JOIN public.v_domains ON v_domains.domain_uuid = v_conference_centers.domain_uuid 
            JOIN public.v_conference_rooms ON v_conference_centers.conference_center_uuid = v_conference_rooms.conference_center_uuid
            WHERE v_conference_centers.conference_center_uuid = '$id'";
            $result = pg_query($con, $query);
            return $result;
        }


        public function fetch_by_domain($con, $id) {
            $query = "SELECT * FROM public.v_conference_centers
            JOIN public.v_domains ON v_domains.domain_uuid = v_conference_centers.domain_uuid 
            JOIN public.v_conference_rooms ON v_conference_centers.conference_center_uuid = v_conference_rooms.conference_center_uuid
            WHERE v_conference_centers.domain_uuid = '$id'";
            $result = pg_query($con, $query);
            return $result;
        }

        public function post($con, $uuid, $data, $userID,$dialplanuuid,$room_uuid) {

            $name = $data->name;
            $extension = $data->extension;
            $conference_center_pin_length = (isset($data->conference_center_pin_length)) ? $data->conference_center_pin_length : 9;
            $conference_center_greeting = (isset($data->conference_center_greeting)) ? $data->conference_center_greeting : '';
            $domain_id = $data->domain_id;

            //room params
            $conference_room_name = (isset($data->conference_room_name)) ? $data->conference_room_name : '';
            $moderator_pin = (isset($data->moderator_pin)) ? $data->moderator_pin : '';
            $participant_pin = (isset($data->participant_pin)) ? $data->participant_pin : '';
            $profile = (isset($data->profile)) ? $data->profile : 'default';
            $record = (isset($data->record)) ? $data->record : 'false';
            $max_members = (isset($data->max_members)) ? $data->max_members : 0;
            $wait_mod = (isset($data->wait_mod)) ? $data->wait_mod : 'true';
            $moderator_endconf = (isset($data->moderator_endconf)) ? $data->moderator_endconf : 'false';
            $announce_name = (isset($data->announce_name)) ? $data->announce_name : 'true';
            $announce_count = (isset($data->announce_count)) ? $data->announce_count : 'true';
            $announce_recording = (isset($data->announce_recording)) ? $data->announce_recording : 'true';
            $mute = (isset($data->mute)) ? $data->mute : 'false';
            $sounds = (isset($data->sounds)) ? $data->sounds : 'true';
            

            if (empty(trim($extension))) {
                echo json_encode([
                    "msg"     => 'Extension cannot be EMPTY !'
                ]);
                return;
            } elseif (empty(trim($name))) {
                echo json_encode([
                    "msg"     => 'Name Cannot be EMPTY !'
                ]);
                return;
            } elseif (empty(($domain_id))) {
                echo json_encode([
                    "msg"     => 'Please Select Domain !'
                ]);
                return;
            }

            $insertConferenceCenter = "INSERT INTO public.v_conference_centers (conference_center_uuid, domain_uuid, conference_center_name, conference_center_extension, conference_center_pin_length, conference_center_greeting, conference_center_enabled) VALUES ('$uuid', '$domain_id', '$name', '$extension', '$conference_center_pin_length', '$conference_center_greeting', 'true')";
            $resultConferenceCenter = pg_query($con, $insertConferenceCenter);
            if ($resultConferenceCenter) {

                $insertRoom = "INSERT INTO public.v_conference_rooms (conference_room_uuid, domain_uuid, conference_center_uuid,conference_room_name, moderator_pin, participant_pin, profile, record, max_members, wait_mod, moderator_endconf, announce_name, announce_count,announce_recording, mute,sounds,enabled) VALUES ('$room_uuid', '$domain_id', '$uuid', '$conference_room_name', '$moderator_pin', '$participant_pin', '$profile','$record', '$max_members','$wait_mod','$moderator_endconf','$announce_name','$announce_count','$announce_recording','$mute','$sounds','true')";
                $resultRoom = pg_query($con, $insertRoom);
                
                
                $domain = "SELECT * FROM public.v_domains WHERE domain_uuid = '$domain_id'";
                $resultDomain = pg_query($con, $domain);

                if (pg_num_rows($resultDomain) > 0) {
                    $row = pg_fetch_assoc($resultDomain); 
                    $domain_name = $row['domain_name'];

                    $dialplan_uuid = $this->create_dialplan($con,$uuid,$data,$userID,$domain_name);
                    SocketConnection::cache_delete("dialplan:".$domain_name);

                    $updateDialplan = "UPDATE public.v_conference_centers SET 
                    dialplan_uuid = '$dialplan_uuid'
                    WHERE conference_center_uuid = '$uuid'";
                    pg_query($con, $updateDialplan);
                }

                echo json_encode([
                    "msg"     => 'Conference center Created Successfully !!',
                    "id"      => $uuid,
                ]); 
                return;
            } else {
                echo json_encode([

                    "msg"     => 'Failed to Create Conference center, Try Again !!'
                ]);
                return;
            }       
        }

        public function create_dialplan($con,$conference_center_uuid, $data, $userID, $domain_name)
        {		
		
    		$extension = $data->extension;
    		$domain_id = $data->domain_id;
    		$conference_center_pin_length = (isset($data->conference_center_pin_length)) ? $data->conference_center_pin_length : 9;
    		$name = $data->name;
    		$app_uuid='b81412e8-7253-91f4-e48e-42fc2c9a38d9';

            $dialplan_uuid = Uuid::uuid4()->toString();

    		$dialplan_xml = "<extension name=\"".$name."\" continue=\"\" uuid=\"".$dialplan_uuid."\">\n";
            if ($conference_center_pin_length > 1 && $conference_center_pin_length < 4) {
                $dialplan_xml .= "  <condition field=\"destination_number\" expression=\"^(".$extension.")(\d{".$conference_center_pin_length."})$\" break=\"on-true\">\n";
                $dialplan_xml .= "      <action application=\"set\" data=\"destination_number=$1\"/>\n";
                $dialplan_xml .= "      <action application=\"set\" data=\"pin_number=$2\"/>\n";
                $dialplan_xml .= "      <action application=\"lua\" data=\"app.lua conference_center\"/>\n";
                $dialplan_xml .= "  </condition>\n";
            }
            $dialplan_xml .= "  <condition field=\"destination_number\" expression=\"^".$extension."$\">\n";
            $dialplan_xml .= "      <action application=\"lua\" data=\"app.lua conference_center\"/>\n";
            $dialplan_xml .= "  </condition>\n";
            $dialplan_xml .= "</extension>\n";

    	  
    	    $insertdialplan = "INSERT INTO public.v_dialplans (dialplan_uuid, domain_uuid, dialplan_context, dialplan_name, dialplan_number, dialplan_continue, dialplan_xml,dialplan_order, dialplan_enabled, insert_user,app_uuid) VALUES ('$dialplan_uuid', '$domain_id', '$domain_name', '$name', '$extension', 'false', '$dialplan_xml' ,'333', 'true', '$userID', '$app_uuid')";
    	    $result_dialplan = pg_query($con, $insertdialplan);
    	 
    	    if ($result_dialplan) {
                    
                return $dialplan_uuid;
            } else {
                echo json_encode([

                    "msg"     => 'Failed to Create Dialplan, Try Again !!'
					
                ]);
                return $dialplan_uuid;
            }    
	   }


        public function update($con, $data, $userID) {


            $name = $data->name;
            $extension = $data->extension;
            $conference_center_pin_length = (isset($data->conference_center_pin_length)) ? $data->conference_center_pin_length : 9;
            $conference_center_greeting = (isset($data->conference_center_greeting)) ? $data->conference_center_greeting : '';
            $domain_id = $data->domain_id;

            //room params
            $conference_room_name = (isset($data->conference_room_name)) ? $data->conference_room_name : '';
            $moderator_pin = (isset($data->moderator_pin)) ? $data->moderator_pin : '';
            $participant_pin = (isset($data->participant_pin)) ? $data->participant_pin : '';
            $profile = (isset($data->profile)) ? $data->profile : 'default';
            $record = (isset($data->record)) ? $data->record : 'false';
            $max_members = (isset($data->max_members)) ? $data->max_members : 0;
            $wait_mod = (isset($data->wait_mod)) ? $data->wait_mod : 'true';
            $moderator_endconf = (isset($data->moderator_endconf)) ? $data->moderator_endconf : 'false';
            $announce_name = (isset($data->announce_name)) ? $data->announce_name : 'true';
            $announce_count = (isset($data->announce_count)) ? $data->announce_count : 'true';
            $announce_recording = (isset($data->announce_recording)) ? $data->announce_recording : 'true';
            $mute = (isset($data->mute)) ? $data->mute : 'false';
            $sounds = (isset($data->sounds)) ? $data->sounds : 'true';
        

            $conference_center_id = $data->conference_center_id;


            if (empty(trim($extension))) {
                echo json_encode([
                    "msg"     => 'Extension cannot be EMPTY !'
                ]);
                return;
            } elseif (empty(trim($name))) {
                echo json_encode([
                    "msg"     => 'Name Cannot be EMPTY !'
                ]);
                return;
            } elseif (empty(($domain_id))) {
                echo json_encode([
                    "msg"     => 'Please Select Domain !'
                ]);
                return;
            } elseif (empty(($conference_center_id))) {
                echo json_encode([
                    "msg"     => 'conference center id cannot be EMPTY !'
                ]);
                return;
            }

            

            $editConferenceCenter = "UPDATE public.v_conference_centers SET
            conference_center_name = '$name',
            conference_center_extension = '$extension',
            conference_center_pin_length = '$conference_center_pin_length',
            conference_center_greeting = '$conference_center_greeting' 
            WHERE conference_center_uuid = '$conference_center_id'";
            $resultConferenceCenter = pg_query($con, $editConferenceCenter);
            if ($resultConferenceCenter) {

                $editRoom = "UPDATE public.v_conference_rooms SET
                conference_room_name = '$conference_room_name',
                moderator_pin = '$moderator_pin',
                participant_pin = '$participant_pin',
                profile = '$profile',
                record = '$record',
                max_members = '$max_members',
                wait_mod = '$wait_mod',
                moderator_endconf = '$moderator_endconf',
                announce_name = '$announce_name',
                announce_count = '$announce_count',
                announce_recording = '$announce_recording',
                mute = '$mute',
                sounds = '$sounds',
                enabled = 'true' 
                WHERE conference_center_uuid = '$conference_center_id'";
                $resultRoom = pg_query($con, $editRoom);

                $checkDialplan = "SELECT * FROM public.v_conference_centers WHERE conference_center_uuid = '$conference_center_id'";
                $resultCheckDialplan = pg_query($con, $checkDialplan);
                if (pg_num_rows($resultCheckDialplan) > 0) {
                    $row = pg_fetch_assoc($resultCheckDialplan); 
                    $dialplan_id = $row['dialplan_uuid'];
                    $queryDeleteDialplan = "DELETE FROM public.v_dialplans WHERE dialplan_uuid = '$dialplan_id'";
                    pg_query($con, $queryDeleteDialplan);
                }

                $domain = "SELECT * FROM public.v_domains WHERE domain_uuid = '$domain_id'";
                $resultDomain = pg_query($con, $domain);

                if (pg_num_rows($resultDomain) > 0) {
                    $row = pg_fetch_assoc($resultDomain); 
                    $domain_name = $row['domain_name'];

                    $dialplan_uuid = $this->create_dialplan($con, $conference_center_id, $data, $userID,$domain_name);
                    SocketConnection::cache_delete("dialplan:".$domain_name);

                    $updateDialplan = "UPDATE public.v_conference_centers SET 
                    dialplan_uuid = '$dialplan_uuid'
                    WHERE conference_center_uuid = '$conference_center_id'";
                    pg_query($con, $updateDialplan);
                }


                echo json_encode([
                    "msg"     => 'Conference Center Updated Successfully !!',
                    "conference_center_id"      => $conference_center_id
                ]);
                return;
            } else {
                echo json_encode([

                    "msg"     => 'Failed to Update Conference Center, Try Again !!'
                ]);
                return;
            }       
        }



        public function delete($con, $id) {
            $checkDialplan = "SELECT * FROM public.v_conference_centers WHERE conference_center_uuid = '$id'";
            $resultCheckDialplan = pg_query($con, $checkDialplan);
            if (pg_num_rows($resultCheckDialplan) > 0) {
                $row = pg_fetch_assoc($resultCheckDialplan); 
                $dialplan_id = $row['dialplan_uuid'];
                $queryDeleteDialplan = "DELETE FROM public.v_dialplans WHERE dialplan_uuid = '$dialplan_id'";
                pg_query($con, $queryDeleteDialplan);
                // $queryDeleteDialplanDetails = "DELETE FROM public.v_dialplan_details WHERE dialplan_uuid = '$dialplan_id'";
                // pg_query($con, $queryDeleteDialplanDetails);
            }

            $query = "DELETE FROM public.v_conference_centers WHERE conference_center_uuid = '$id'";
            $result = pg_query($con, $query);
            if ($result) {
                $queryRoom = "DELETE FROM public.v_conference_rooms WHERE conference_center_uuid = '$id'";
                $resultRoom = pg_query($con, $queryRoom);
                if ($resultRoom) {
                    echo json_encode([
                        "message" => "Conference Center Deleted Successfully !!"
                    ]);            
                    return;
                } else {
                    echo json_encode([
                        "message" => "Failed to Delete Conference Center, Try Again !!"
                    ]);            
                    return;
                }
            } else {
                echo json_encode([
                    "message" => "Failed to Delete Conference Center, Try Again !!"
                ]);            
                return;
            }
        }

       
    }
?>
