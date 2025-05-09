<?php
    require("../../config/config.php");
    require("../classes/SocketConnection.php");
    use Ramsey\Uuid\Uuid;

    class RingGroup {

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
            $query = 'SELECT * FROM public.v_ring_groups
            JOIN public.v_domains
            ON v_domains.domain_uuid = v_ring_groups.domain_uuid';
            $result = pg_query($con, $query);
            return $result;
        }

        public function fetch_by_id($con, $id, $domain_uuid) {
            $query = "SELECT v_ring_groups.*, v_domains.*, array_agg(v_ring_group_destinations.destination_number) AS destinations,
            CASE 
                WHEN v_ring_groups.ring_group_strategy = 'sequence' THEN MAX(v_ring_group_destinations.destination_timeout) ELSE v_ring_groups.ring_group_call_timeout 
            END AS duration,
            CASE 
                WHEN v_ring_groups.ring_group_timeout_data = concat('streamfile.lua', v_recordings.recording_filename) THEN 'recording'
                WHEN v_ring_groups.ring_group_timeout_data = concat(v_ivr_menus.ivr_menu_extension, ' XML ', v_domains.domain_name) THEN 'ivr'
                WHEN v_ring_groups.ring_group_timeout_data = concat(rd2.ring_group_extension, ' XML ', v_domains.domain_name) THEN 'ringGroup'
                WHEN v_ring_groups.ring_group_timeout_data = concat(v_extensions.extension, ' XML ', v_domains.domain_name) THEN 'extension'
                WHEN v_ring_groups.ring_group_timeout_data = concat(v_conference_centers.conference_center_extension, ' XML ', v_domains.domain_name) THEN 'conference'
                WHEN v_ring_groups.ring_group_timeout_data = concat(v_dialplans.dialplan_number, ' XML ', v_domains.domain_name) THEN 'dialplan'
                ELSE NULL
            END AS remote_no_answer_strategy,
            CASE 
                WHEN v_ring_groups.ring_group_timeout_data = concat('streamfile.lua', v_recordings.recording_filename) THEN v_recordings.recording_uuid
                WHEN v_ring_groups.ring_group_timeout_data = concat(v_ivr_menus.ivr_menu_extension, ' XML ', v_domains.domain_name) THEN v_ivr_menus.ivr_menu_uuid
                WHEN v_ring_groups.ring_group_timeout_data = concat(rd2.ring_group_extension, ' XML ', v_domains.domain_name) THEN rd2.ring_group_uuid
                WHEN v_ring_groups.ring_group_timeout_data = concat(v_extensions.extension, ' XML ', v_domains.domain_name) THEN v_extensions.extension_uuid
                WHEN v_ring_groups.ring_group_timeout_data = concat(v_conference_centers.conference_center_extension, ' XML ', v_domains.domain_name) THEN v_conference_centers.conference_center_uuid
                WHEN v_ring_groups.ring_group_timeout_data = concat(v_dialplans.dialplan_number, ' XML ', v_domains.domain_name) THEN v_dialplans.dialplan_uuid
                ELSE NULL
            END AS endpoint_uuid
            FROM public.v_ring_groups
            JOIN public.v_domains
            ON v_domains.domain_uuid = v_ring_groups.domain_uuid
            LEFT JOIN public.v_ring_group_destinations
			ON v_ring_group_destinations.ring_group_uuid = v_ring_groups.ring_group_uuid

            LEFT JOIN public.v_ring_groups rd2 ON v_ring_groups.ring_group_timeout_data = concat(rd2.ring_group_extension, ' XML ',v_domains.domain_name)
            LEFT JOIN public.v_recordings ON v_ring_groups.ring_group_timeout_data = concat('streamfile.lua', v_recordings.recording_filename)
            LEFT JOIN public.v_ivr_menus ON v_ring_groups.ring_group_timeout_data = concat(v_ivr_menus.ivr_menu_extension, ' XML ', v_domains.domain_name)
            LEFT JOIN public.v_extensions ON v_ring_groups.ring_group_timeout_data = concat(v_extensions.extension, ' XML ', v_domains.domain_name)
            LEFT JOIN public.v_conference_centers ON v_ring_groups.ring_group_timeout_data = concat(v_conference_centers.conference_center_extension, ' XML ', v_domains.domain_name)
            LEFT JOIN public.v_dialplans ON v_ring_groups.ring_group_timeout_data = concat(v_dialplans.dialplan_number, ' XML ', v_domains.domain_name)

            WHERE v_ring_groups.ring_group_uuid = '$id' AND v_ring_groups.domain_uuid = '$domain_uuid' 
            GROUP BY v_domains.domain_uuid, v_ring_groups.ring_group_uuid, v_recordings.recording_filename, v_ivr_menus.ivr_menu_extension, v_ring_groups.ring_group_extension, v_extensions.extension, v_conference_centers.conference_center_extension, v_dialplans.dialplan_number, v_recordings.recording_uuid, v_ivr_menus.ivr_menu_uuid, v_extensions.extension_uuid, v_conference_centers.conference_center_uuid, v_dialplans.dialplan_uuid, rd2.ring_group_extension, rd2.ring_group_uuid";
            $result = pg_query($con, $query);

            return $result;
        }

        public function fetch_by_extension($con, $extension, $domain_uuid) {
            $query = "SELECT v_ring_groups.*, v_domains.*, array_agg(v_ring_group_destinations.destination_number) AS destinations,
            CASE 
                WHEN v_ring_groups.ring_group_strategy = 'sequence' THEN MAX(v_ring_group_destinations.destination_timeout) ELSE v_ring_groups.ring_group_call_timeout 
            END AS duration,
            CASE 
                WHEN v_ring_groups.ring_group_timeout_data = concat('streamfile.lua', v_recordings.recording_filename) THEN 'recording'
                WHEN v_ring_groups.ring_group_timeout_data = concat(v_ivr_menus.ivr_menu_extension, ' XML ', v_domains.domain_name) THEN 'ivr'
                WHEN v_ring_groups.ring_group_timeout_data = concat(rd2.ring_group_extension, ' XML ', v_domains.domain_name) THEN 'ringGroup'
                WHEN v_ring_groups.ring_group_timeout_data = concat(v_extensions.extension, ' XML ', v_domains.domain_name) THEN 'extension'
                WHEN v_ring_groups.ring_group_timeout_data = concat(v_conference_centers.conference_center_extension, ' XML ', v_domains.domain_name) THEN 'conference'
                WHEN v_ring_groups.ring_group_timeout_data = concat(v_dialplans.dialplan_number, ' XML ', v_domains.domain_name) THEN 'dialplan'
                ELSE NULL
            END AS remote_no_answer_strategy,
            CASE 
                WHEN v_ring_groups.ring_group_timeout_data = concat('streamfile.lua', v_recordings.recording_filename) THEN v_recordings.recording_uuid
                WHEN v_ring_groups.ring_group_timeout_data = concat(v_ivr_menus.ivr_menu_extension, ' XML ', v_domains.domain_name) THEN v_ivr_menus.ivr_menu_uuid
                WHEN v_ring_groups.ring_group_timeout_data = concat(rd2.ring_group_extension, ' XML ', v_domains.domain_name) THEN rd2.ring_group_uuid
                WHEN v_ring_groups.ring_group_timeout_data = concat(v_extensions.extension, ' XML ', v_domains.domain_name) THEN v_extensions.extension_uuid
                WHEN v_ring_groups.ring_group_timeout_data = concat(v_conference_centers.conference_center_extension, ' XML ', v_domains.domain_name) THEN v_conference_centers.conference_center_uuid
                WHEN v_ring_groups.ring_group_timeout_data = concat(v_dialplans.dialplan_number, ' XML ', v_domains.domain_name) THEN v_dialplans.dialplan_uuid
                ELSE NULL
            END AS endpoint_uuid
            FROM public.v_ring_groups
            JOIN public.v_domains
            ON v_domains.domain_uuid = v_ring_groups.domain_uuid
            LEFT JOIN public.v_ring_group_destinations
			ON v_ring_group_destinations.ring_group_uuid = v_ring_groups.ring_group_uuid

            LEFT JOIN public.v_ring_groups rd2 ON v_ring_groups.ring_group_timeout_data = concat(rd2.ring_group_extension, ' XML ',v_domains.domain_name)
            LEFT JOIN public.v_recordings ON v_ring_groups.ring_group_timeout_data = concat('streamfile.lua', v_recordings.recording_filename)
            LEFT JOIN public.v_ivr_menus ON v_ring_groups.ring_group_timeout_data = concat(v_ivr_menus.ivr_menu_extension, ' XML ', v_domains.domain_name)
            LEFT JOIN public.v_extensions ON v_ring_groups.ring_group_timeout_data = concat(v_extensions.extension, ' XML ', v_domains.domain_name)
            LEFT JOIN public.v_conference_centers ON v_ring_groups.ring_group_timeout_data = concat(v_conference_centers.conference_center_extension, ' XML ', v_domains.domain_name)
            LEFT JOIN public.v_dialplans ON v_ring_groups.ring_group_timeout_data = concat(v_dialplans.dialplan_number, ' XML ', v_domains.domain_name)

            WHERE v_ring_groups.ring_group_extension = '$extension' AND v_ring_groups.domain_uuid = '$domain_uuid' 
            GROUP BY v_domains.domain_uuid, v_ring_groups.ring_group_uuid, v_recordings.recording_filename, v_ivr_menus.ivr_menu_extension, v_ring_groups.ring_group_extension, v_extensions.extension, v_conference_centers.conference_center_extension, v_dialplans.dialplan_number, v_recordings.recording_uuid, v_ivr_menus.ivr_menu_uuid, v_extensions.extension_uuid, v_conference_centers.conference_center_uuid, v_dialplans.dialplan_uuid, rd2.ring_group_extension, rd2.ring_group_uuid";
            $result = pg_query($con, $query);

            return $result;
        }

        public function fetch_ring_group($con, $id) {
            $query = "SELECT * FROM public.v_ring_group_destinations
            JOIN public.v_ring_groups
            ON v_ring_group_destinations.ring_group_uuid = v_ring_groups.ring_group_uuid
            WHERE v_ring_groups.ring_group_uuid = '$id'";
            $result = pg_query($con, $query);
            return $result;
        }

        public function fetch_ring_group_destination_by_id($con, $id) {
            $query = "SELECT * FROM public.v_ring_group_destinations WHERE ring_group_destination_uuid = '$id'";
            $result = pg_query($con, $query);
            return $result;
        }

        public function fetch_by_domain($con, $id, $limit, $page, $search, $sort_column, $sort_direction) {
            $offset = ($page - 1) * $limit;
            $query = "SELECT ring_group_description, ring_group_uuid, ring_group_extension, ring_group_name, ring_group_caller_id_number, insert_date FROM public.v_ring_groups
            WHERE v_ring_groups.domain_uuid = '$id' "; 

            $total_count_query = "SELECT count(*) FROM public.v_ring_groups
                WHERE v_ring_groups.domain_uuid = '$id' ";

            if ($search) {
                $query .= "AND (ring_group_description ILIKE '%$search%' OR ring_group_extension ILIKE '%$search%' OR ring_group_name ILIKE '%$search%' OR ring_group_caller_id_number ILIKE '%$search%') ";
                $total_count_query .= "AND (ring_group_description ILIKE '%$search%' OR ring_group_extension ILIKE '%$search%' OR ring_group_name ILIKE '%$search%' OR ring_group_caller_id_number ILIKE '%$search%') ";
            }

            $query .= "ORDER BY ";
            if ($sort_column == 'name') {
                $query .= "LOWER(ring_group_name) $sort_direction, ";
            }

            if ($sort_column == "description") {
                $query .= "LOWER(ring_group_description) $sort_direction, ";
            }

            if ($sort_column == "phone_number") {
                $query .= "ring_group_caller_id_number $sort_direction, ";
            }

            if ($sort_column == "extension") {
                $query .= "LOWER(ring_group_extension) $sort_direction, ";
            }

            if ($sort_column == "date") {
                $query .= "insert_date $sort_direction ";
            } else {
                $query .= "insert_date desc ";
            }
            
            $query .= "LIMIT $limit 
            OFFSET $offset";
            $result = pg_query($con, $query);

            $total_count_result = pg_query($con, $total_count_query);
            return [
                'result' => $result,
                'total_count' => $total_count_result,
            ];
        }

        public function post($con, $uuidringGroup, $data, $userID,$dialplanuuid) {

            $name = $data->name;
            $extension = $data->extension;
            $ring_group_greeting = $data->ring_group_greeting;
            $ring_group_timeout_app = $data->ring_group_timeout_app;
            $ring_group_timeout_data = $data->ring_group_timeout_data;
            $ring_group_call_timeout = (strlen($data->ring_group_call_timeout) == 0) ? 30 : (int)$data->ring_group_call_timeout;
            $ring_group_caller_id_name = $data->ring_group_caller_id_name;
            $ring_group_caller_id_number = $data->ring_group_caller_id_number;
            $ring_group_ringback = (strlen($data->ring_group_ringback) == 0) ? "\${us-ring}" : $data->ring_group_ringback;
            $ring_group_call_forward_enabled = $data->ring_group_call_forward_enabled;
            $ring_group_follow_me_enabled = $data->ring_group_follow_me_enabled;
            $ring_group_missed_call_app = $data->ring_group_missed_call_app;
            $ring_group_missed_call_data = $data->ring_group_missed_call_data;
            $ring_group_forward_enabled = (strlen($data->ring_group_forward_enabled) == 0) ? 'false' : $data->ring_group_forward_enabled;
            $ring_group_forward_destination = $data->ring_group_forward_destination;
            $ring_group_forward_toll_allow = $data->ring_group_forward_toll_allow;
            $ring_group_description = $data->ring_group_description;
            $context = $data->context;
            $domain_id = $data->domain_id;
            $ring_group_strategy = $data->ring_group_strategy;
            $ring_group_enabled = $data->ring_group_enabled;

            $ring_group_destinations = $data->ring_group_destinations;

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
            } elseif (empty(($context))) {
                echo json_encode([
                    "msg"     => 'Context cannot be EMPTY !'
                ]);
                return;
            }

            if (empty($ring_group_strategy)){
                $ring_group_strategy = 'simultaneous';
            }

            //$usRing = "\${us-ring}";

            // $userID = '3d7c90a5-3936-422a-8fac-4dbfbea35237';
            $insertRingGroup = "INSERT INTO public.v_ring_groups (ring_group_uuid, domain_uuid, ring_group_name, ring_group_extension, ring_group_context, ring_group_call_timeout, ring_group_forward_enabled, ring_group_strategy, ring_group_ringback, ring_group_enabled, insert_user, ring_group_greeting,ring_group_timeout_app,ring_group_timeout_data, ring_group_caller_id_name, ring_group_caller_id_number, ring_group_call_forward_enabled,ring_group_follow_me_enabled,ring_group_missed_call_app, ring_group_missed_call_data, ring_group_forward_destination,ring_group_forward_toll_allow, ring_group_description,dialplan_uuid, insert_date) 
                                                          VALUES ('$uuidringGroup', '$domain_id', '$name', '$extension', '$context', '$ring_group_call_timeout', '$ring_group_forward_enabled', '$ring_group_strategy', '$ring_group_ringback', '$ring_group_enabled', '$userID', '$ring_group_greeting', '$ring_group_timeout_app', '$ring_group_timeout_data', '$ring_group_caller_id_name','$ring_group_caller_id_number', '$ring_group_call_forward_enabled','$ring_group_follow_me_enabled','$ring_group_missed_call_app','$ring_group_missed_call_data','$ring_group_forward_destination', '$ring_group_forward_toll_allow', '$ring_group_description','$dialplanuuid', CURRENT_TIMESTAMP)";
            $resultRingGroup = pg_query($con, $insertRingGroup);
            if ($resultRingGroup) {

                // start : 04/08/2024 : atul
                $destination_array = array();
                if(!empty($ring_group_destinations)){
                    foreach ($ring_group_destinations as $k) {

                        $uuid = Uuid::uuid4();                        
                        // Get the UUID as a string
                        $uuidRingGroupDestination = $uuid->toString();
                        $ring_group_id = $uuidringGroup;
                        $destination_number = $k->destination_number;
                        $destination_delay = $k->destination_delay;
                        $destination_timeout = (int)$k->destination_timeout;
                        $destination_prompt = 'null';
                        $ringgroup_destination_enabled = $k->destination_enabled;

                        array_push($destination_array, array('destination_number'=>$destination_number,'ring_group_destination_uuid'=>$uuidRingGroupDestination));

                        $this->postDestination($con, $uuidRingGroupDestination, $ring_group_id, $domain_id, $destination_number, $destination_delay, $destination_timeout, $ringgroup_destination_enabled, $userID, $destination_prompt);
                    }
                }
                // end : 04/08/2024 : atul

                SocketConnection::cache_delete("dialplan:".$context);

                echo json_encode([
                    "msg"     => 'Ring Group Created Successfully !!',
                    "id"      => $uuidringGroup,
                    "ring_group_destinations"      => $destination_array
                ]); 
                return;
            } else {
                echo json_encode([

                    "msg"     => 'Failed to Create Ring Group, Try Again !!'
                ]);
                return;
            }       
        }

// Date :14-Aug-2024 Added by Atul 
public function create_dialplan($con,$uuidringGroup, $data, $userID, $dialplanuuid)
{		
		
		$extension = $data->extension;
		$domain_id = $data->domain_id;
		$context = $data->context;
		$name = $data->name;
        $ring_group_enabled = $data->ring_group_enabled;
        $ring_group_description = $data->ring_group_description;
		$app_uuid='1d61fb65-1eec-bc73-a6ee-a6203b4fe6f2';
		$dialplan_xml = "<extension name=\"$name\" continue=\"\" uuid=\"$dialplanuuid\">
                     <condition field=\"destination_number\" expression=\"^$extension$\">
                       <action application=\"ring_ready\" data=\"\"/>
                       <action application=\"set\" data=\"ring_group_uuid=$uuidringGroup\"/>
                       <action application=\"lua\" data=\"app.lua ring_groups\"/>
                     </condition>
                   </extension>";

	  
	 $insertdialplan = "INSERT INTO public.v_dialplans (dialplan_uuid, domain_uuid, dialplan_context, dialplan_name, dialplan_number, dialplan_continue, dialplan_xml,dialplan_order, dialplan_enabled, dialplan_description, insert_user,app_uuid) VALUES ('$dialplanuuid', '$domain_id', '$context', '$name', '$extension', 'false', '$dialplan_xml' ,'101', '$ring_group_enabled', '$ring_group_description', '$userID', '$app_uuid')";
	 $ringgroup_dialplan = pg_query($con, $insertdialplan);
	 
	  if ($ringgroup_dialplan) {
                //echo json_encode([
                 //   "msg1"     => 'Dialplan Created Successfully !!',
                  //  "dialplan_uuid"      => $dialplanuuid
					
               // ]);
                return $dialplanuuid;
            } else {
                echo json_encode([

                    "msg"     => 'Failed to Create Ringgroup Dialplan, Try Again !!'
					
                ]);
                return $dialplanuuid;
            }    
	}


// END 
        public function postDestination($con, $uuidRingGroupDestination, $ring_group_id, $domain, $destination_number, $destination_delay, $destination_timeout, $ringGroupDestination_enabled, $userID, $destination_prompt) {
            if (empty(trim($destination_number))) {
                echo json_encode([
                    "msg"     => 'Destination cannot be EMPTY !'
                ]);
                return;
            }

            if (empty($destination_timeout)){
                $destination_timeout = 30;
            }

            // $userID = '3d7c90a5-3936-422a-8fac-4dbfbea35237';
            $insertRingGroupDestination = "INSERT INTO public.v_ring_group_destinations (ring_group_destination_uuid, ring_group_uuid, domain_uuid, destination_number, destination_delay, destination_timeout, destination_enabled, insert_user, destination_prompt) 
                                                                                VALUES ('$uuidRingGroupDestination', '$ring_group_id', '$domain', '$destination_number', '$destination_delay', '$destination_timeout', '$ringGroupDestination_enabled', '$userID', $destination_prompt)";
            $resultRingGroupDestination = pg_query($con, $insertRingGroupDestination);
            if ($resultRingGroupDestination) {
                // echo json_encode([
                //     "msg"     => 'Ring Group Destination Created Successfully !!',
                //     "id"      => $uuidRingGroupDestination
                // ]);
                return;
            } else {
                echo json_encode([

                    "msg"     => 'Failed to Create Ring Group Destination, Try Again !!'
                ]);
                return;
            }       
        }

        public function update($con, $data, $userID) {


            $name = $data->name;
            $extension = $data->extension;
            $domain = $data->domain_id;
            $context = $data->context;
            $ring_group_strategy = $data->ring_group_strategy;
            $ring_group_enabled = $data->ring_group_enabled;
            $ring_group_id = $data->ring_group_id;


            $ring_group_greeting = $data->ring_group_greeting;
            $ring_group_timeout_app = $data->ring_group_timeout_app;
            $ring_group_timeout_data = $data->ring_group_timeout_data;
            $ring_group_call_timeout = (int)(strlen($data->ring_group_call_timeout) == 0) ? 30 : (int)$data->ring_group_call_timeout;
            $ring_group_caller_id_name = $data->ring_group_caller_id_name;
            $ring_group_caller_id_number = $data->ring_group_caller_id_number;
            $ring_group_ringback = (strlen($data->ring_group_ringback) == 0) ? "\${us-ring}" : $data->ring_group_ringback;
            $ring_group_call_forward_enabled = $data->ring_group_call_forward_enabled;
            $ring_group_follow_me_enabled = $data->ring_group_follow_me_enabled;
            $ring_group_missed_call_app = $data->ring_group_missed_call_app;
            $ring_group_missed_call_data = $data->ring_group_missed_call_data;
            $ring_group_forward_enabled = (strlen($data->ring_group_forward_enabled) == 0) ? 'false' : $data->ring_group_forward_enabled;
            $ring_group_forward_destination = $data->ring_group_forward_destination;
            $ring_group_forward_toll_allow = $data->ring_group_forward_toll_allow;
            $ring_group_description = $data->ring_group_description;
        

            $ring_group_destinations = $data->ring_group_destinations;


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
            } elseif (empty(($domain))) {
                echo json_encode([
                    "msg"     => 'Please Select Domain !'
                ]);
                return;
            } elseif (empty(($context))) {
                echo json_encode([
                    "msg"     => 'Context cannot be EMPTY !'
                ]);
                return;
            }

            if (empty($ring_group_strategy)){
                $ring_group_strategy = 'simultaneous';
            }

            $editRingGroup = "UPDATE public.v_ring_groups SET
            domain_uuid = '$domain',
            ring_group_name = '$name',
            ring_group_extension = '$extension',
            ring_group_context = '$context',
            ring_group_strategy = '$ring_group_strategy',

            ring_group_greeting = '$ring_group_greeting',
            ring_group_timeout_app = '$ring_group_timeout_app',
            ring_group_timeout_data = '$ring_group_timeout_data',
            ring_group_call_timeout = '$ring_group_call_timeout',
            ring_group_caller_id_name = '$ring_group_caller_id_name',
            ring_group_caller_id_number = '$ring_group_caller_id_number',
            ring_group_call_forward_enabled = '$ring_group_call_forward_enabled',
            ring_group_follow_me_enabled = '$ring_group_follow_me_enabled',
            ring_group_missed_call_app = '$ring_group_missed_call_app',
            ring_group_missed_call_data = '$ring_group_missed_call_data',
            ring_group_forward_enabled = '$ring_group_forward_enabled',
            ring_group_forward_destination = '$ring_group_forward_destination',
            ring_group_forward_toll_allow = '$ring_group_forward_toll_allow',
            ring_group_description = '$ring_group_description',

            ring_group_enabled = '$ring_group_enabled'
            WHERE ring_group_uuid = '$ring_group_id'";
            $resultRingGroup = pg_query($con, $editRingGroup);
            if ($resultRingGroup) {

                $checkDialplan = "SELECT * FROM public.v_ring_groups WHERE ring_group_uuid = '$ring_group_id'";
                $resultCheckDialplan = pg_query($con, $checkDialplan);
                if (pg_num_rows($resultCheckDialplan) > 0) {
                    $row = pg_fetch_assoc($resultCheckDialplan); 
                    $dialplan_id = $row['dialplan_uuid'];
                    $queryDeleteDialplan = "DELETE FROM public.v_dialplans WHERE dialplan_uuid = '$dialplan_id'";
                    pg_query($con, $queryDeleteDialplan);
                }

                $uuid1 = Uuid::uuid4();
                $dialplanuuid=$uuid1->toString();
                $this->create_dialplan($con, $ring_group_id, $data, $userID,$dialplanuuid);

                $updateRingGroupDialplan = "UPDATE public.v_ring_groups SET 
                dialplan_uuid = '$dialplanuuid'
                WHERE ring_group_uuid = '$ring_group_id'";
                pg_query($con, $updateRingGroupDialplan);

                $queryRingGroupDestination = "DELETE FROM public.v_ring_group_destinations WHERE ring_group_uuid = '$ring_group_id'";
                $resultRingGroupDestination = pg_query($con, $queryRingGroupDestination);

                // start : 04/08/2024 : atul
                $destination_array = array();
                if(!empty($ring_group_destinations)){
                    foreach ($ring_group_destinations as $k) {

                        $uuid = Uuid::uuid4();                        
                        // Get the UUID as a string
                        $uuidRingGroupDestination = $uuid->toString();

                        //$ring_group_destination_id = $k->ring_group_destination_id;
                        $destination_number = $k->destination_number;
                        $destination_delay = $k->destination_delay;
                        $destination_timeout = (int)$k->destination_timeout;
                        $destination_prompt = 'null';
                        $ringgroup_destination_enabled = $k->destination_enabled;

                        array_push($destination_array, array('destination_number'=>$destination_number,'ring_group_destination_uuid'=>$uuidRingGroupDestination));

                        $this->postDestination($con, $uuidRingGroupDestination, $ring_group_id, $domain, $destination_number, $destination_delay, $destination_timeout, $ringgroup_destination_enabled, $userID, $destination_prompt);
                        //$this->updateDestination($con, $ring_group_destination_id, $domain, $destination_number, $destination_delay, $destination_timeout, $ringgroup_destination_enabled,$destination_prompt);
                    }
                }
                // end : 04/08/2024 : atul

                echo json_encode([
                    "msg"     => 'Ring Group Updated Successfully !!',
                    "ring_group_destinations"      => $destination_array
                ]);
                return;
            } else {
                echo json_encode([

                    "msg"     => 'Failed to Update Ring Group, Try Again !!'
                ]);
                return;
            }       
        }

        public function updateDestination($con, $ring_group_destination_id, $domain, $destination_number, $destination_delay, $destination_timeout, $ringGroupDestination_enabled,$destination_prompt) {
            if (empty(trim($destination_number))) {
                echo json_encode([
                    "msg"     => 'Destination cannot be EMPTY !'
                ]);
                return;
            }

            if (empty($destination_timeout)){
                $destination_timeout = 30;
            }

            $editRingGroupDestination = "UPDATE public.v_ring_group_destinations SET
            domain_uuid = '$domain',
            destination_number = '$destination_number',
            destination_delay = '$destination_delay',
            destination_timeout = '$destination_timeout',
            destination_prompt = '$destination_prompt',
            destination_enabled = '$ringGroupDestination_enabled'
            WHERE ring_group_destination_uuid = '$ring_group_destination_id'";
            $resultRingGroupDestination = pg_query($con, $editRingGroupDestination);
            if ($resultRingGroupDestination) {
                // echo json_encode([
                //     "msg"     => 'Ring Group Destination Updated Successfully !!'
                // ]);
                return;
            } else {
                echo json_encode([

                    "msg"     => 'Failed to Update Ring Group Destination, Try Again !!'
                ]);
                return;
            }       
        }

        public function delete($con, $id, $domain_uuid) {
            $checkDialplan = "SELECT * FROM public.v_ring_groups WHERE ring_group_uuid = '$id' AND domain_uuid = '$domain_uuid'";
            $resultCheckDialplan = pg_query($con, $checkDialplan);
            if (pg_num_rows($resultCheckDialplan) > 0) {
                $row = pg_fetch_assoc($resultCheckDialplan); 
                $dialplan_id = $row['dialplan_uuid'];
                $queryDeleteDialplan = "DELETE FROM public.v_dialplans WHERE dialplan_uuid = '$dialplan_id'";
                pg_query($con, $queryDeleteDialplan);
                $queryDeleteDialplanDetails = "DELETE FROM public.v_dialplan_details WHERE dialplan_uuid = '$dialplan_id'";
                pg_query($con, $queryDeleteDialplanDetails);
            }

            $query = "DELETE FROM public.v_ring_groups WHERE ring_group_uuid = '$id' AND domain_uuid = '$domain_uuid'";
            $result = pg_query($con, $query);
            if ($result) {
                $queryRingGroupDestination = "DELETE FROM public.v_ring_group_destinations WHERE ring_group_uuid = '$id'";
                $resultRingGroupDestination = pg_query($con, $queryRingGroupDestination);
                if ($resultRingGroupDestination) {
                    echo json_encode([
                        "message" => "Ring Group Deleted Successfully !!"
                    ]);            
                    return;
                } else {
                    echo json_encode([
                        "message" => "Failed to Delete Ring Group, Try Again !!"
                    ]);            
                    return;
                }
            } else {
                echo json_encode([
                    "message" => "Failed to Delete Ring Group, Try Again !!"
                ]);            
                return;
            }
        }

        public function delete_ring_group_destination($con, $id) {
            $query = "DELETE FROM public.v_ring_group_destinations WHERE ring_group_destination_uuid = '$id'";
            $result = pg_query($con, $query);
            if ($result) {
                echo json_encode([
                    "message" => "Ring Group Destination Deleted Successfully !!"
                ]);            
                return;
            } else {
                echo json_encode([
                    "message" => "Failed to Delete Ring Group Destination, Try Again !!"
                ]);            
                return;
            }
        }

        public function fetch_namelist($con, $id) {
            $query = "SELECT ring_group_extension as extension, ring_group_uuid as uuid, ring_group_name as name, 'transfer' as app, concat(ring_group_extension, ' XML ', v_domains.domain_name) AS data FROM public.v_ring_groups
            JOIN public.v_domains 
            ON v_domains.domain_uuid = v_ring_groups.domain_uuid
            WHERE v_ring_groups.domain_uuid = '$id' 
            ORDER BY ring_group_extension ASC";
            $result = pg_query($con, $query);
            
            if (pg_num_rows($result) > 0 ) {

                $arr = array();
                while ($row = pg_fetch_assoc($result)) {
                    $arr[] = $row;
                }

                return $arr;
            }else{
                return array();
            }
        }
    }
?>
