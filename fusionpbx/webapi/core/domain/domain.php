<?php
    require("../../config/config.php");
    require("../../vendor/autoload.php");
    
    use Ramsey\Uuid\Uuid;

    class Domain {

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
            $query = 'SELECT * FROM public.v_domains';
            $result = pg_query($con, $query);
            return $result;
        }

        public function fetch_domain_by_id($con, $id) {
            $query = "SELECT * FROM public.v_domains WHERE domain_uuid = '$id'";
            $result = pg_query($con, $query);
            return $result;
        }

        public function fetch_domain_by_name($con, $name) {
            $query = "SELECT * FROM public.v_domains WHERE domain_name = '$name'";
            $result = pg_query($con, $query);
            return $result;
        }

        public function post($con, $uuidString, $domain_name, $domain_enabled, $domain_description, $userID) {
            $checkDuplicateDomain = "SELECT * FROM public.v_domains WHERE domain_name = '$domain_name'";
            $result = pg_query($con, $checkDuplicateDomain);
            if (pg_num_rows($result) > 0) {
                echo json_encode([
                    "message" => "This Domain is Already Exists !!"
                ]);            
                return;
            } else {
                // $userID = '3d7c90a5-3936-422a-8fac-4dbfbea35237';
                $insertDomain = "INSERT INTO public.v_domains (domain_uuid, domain_name, domain_enabled, domain_description, insert_user) VALUES ('$uuidString', '$domain_name', '$domain_enabled', '$domain_description', '$userID')";
                $resultDomain = pg_query($con, $insertDomain);
                if ($resultDomain) {
                    if (!file_exists("../../../../../lib/freeswitch/recordings/".$domain_name."/")) {
                        mkdir("../../../../../lib/freeswitch/recordings/".$domain_name."/", 0777, true);
                    }

                    if (!file_exists("/var/lib/freeswitch/recordings/".$domain_name."/")) {
                        mkdir("/var/lib/freeswitch/recordings/".$domain_name."/", 0777, true);
                    }


                    if (!file_exists("/var/lib/freeswitch/storage/voicemail/default/".$domain_name)) {
                        mkdir("/var/lib/freeswitch/storage/voicemail/default/".$domain_name, 0770);
                    }
                    

                    $this->create_domain_variable($con, $uuidString, $domain_name, $userID);
                    $this->create_call_limit($con, $uuidString, $domain_name, $userID);
                    $this->create_call_block($con, $uuidString, $domain_name, $userID);
                    $this->create_call_recording_on_demand($con, $uuidString, $domain_name, $userID);
                    $this->create_speed_dial($con, $uuidString, $domain_name, $userID);
                    $this->create_user_hold_music($con, $uuidString, $domain_name, $userID);
                    $this->create_distinctive_ring_local($con, $uuidString, $domain_name, $userID);
                    $this->create_provision($con, $uuidString, $domain_name, $userID);
                    $this->create_group_intercept($con, $uuidString, $domain_name, $userID);
                    $this->create_page($con, $uuidString, $domain_name, $userID);
                    $this->create_page_extension($con, $uuidString, $domain_name, $userID);
                    $this->create_eavesdrop($con, $uuidString, $domain_name, $userID);
                    $this->create_intercept_ext($con, $uuidString, $domain_name, $userID);
                    $this->create_number_queue($con, $uuidString, $domain_name, $userID);
                    $this->create_recordings($con, $uuidString, $domain_name, $userID);
                    $this->create_disa($con, $uuidString, $domain_name, $userID);
                    $this->create_user_record($con, $uuidString, $domain_name, $userID);

                    echo json_encode([
                        "message" => "Domain Created Successfully !!",
                        "id"      => $uuidString
                    ]);            
                    return;
                } else {
                    echo json_encode([
                        "message" => "Failed to Create Domain, Try Again !!"
                    ]);            
                    return;
                }
            }      
        }

        public function update($con, $domain_id, $domain_name, $domain_enabled, $domain_description) {
            $editDomain = "UPDATE public.v_domains SET 
            domain_name = '$domain_name', 
            domain_enabled = '$domain_enabled', 
            domain_description = '$domain_description'
            WHERE domain_uuid = '$domain_id'";
            $resultDomain = pg_query($con, $editDomain);
            if ($resultDomain) {

                if (!file_exists("/var/lib/freeswitch/storage/voicemail/default/".$domain_name)) {
                    mkdir("/var/lib/freeswitch/storage/voicemail/default/".$domain_name, 0770);
                }

                echo json_encode([
                    "message" => "Domain Updated Successfully !!"
                ]);            
                return;
            } else {
                echo json_encode([
                    "message" => "Failed to Update Domain, Try Again !!"
                ]);            
                return;
            }     
        }
       
	 public function delete($con, $id) {
            $query = "DELETE FROM public.v_domains WHERE domain_uuid = '$id'";
            
            $checkDomain = "SELECT * FROM public.v_domains WHERE domain_uuid = '$id'";
            $resultCheckDomain = pg_query($con, $checkDomain);
            if (pg_num_rows($resultCheckDomain) > 0) {
                $row = pg_fetch_assoc($resultCheckDomain); 
                if (file_exists("../../../../../lib/freeswitch/recordings/".$row['domain_name']."/")) {
                        array_map('unlink', glob("../../../../../lib/freeswitch/recordings/".$row['domain_name']."/*.*"));
			rmdir("../../../../../lib/freeswitch/recordings/".$row['domain_name']."/");
                }
                
                if (file_exists("/var/lib/freeswitch/recordings/".$row['domain_name']."/")) {
                    array_map('unlink', glob("/var/lib/freeswitch/recordings/".$row['domain_name']."/*.*"));
                    rmdir("/var/lib/freeswitch/recordings/".$row['domain_name']."/");
                }

                if (file_exists("/var/lib/freeswitch/storage/voicemail/default/".$row['domain_name']."/")) {
		    array_map('unlink', glob("../../../../../lib/freeswitch/storage/voicemail/default/".$row['domain_name']."/*.*"));
                    rmdir("/var/lib/freeswitch/storage/voicemail/default/".$row['domain_name']."/");
                }
            }

            $result = pg_query($con, $query);
            if ($result) {
                pg_query($con, "DELETE FROM public.v_dialplans WHERE domain_uuid = '$id'");
                pg_query($con, "DELETE FROM public.v_dialplan_details WHERE domain_uuid = '$id'");

                //delete cdr
                pg_query($con, "DELETE FROM public.v_xml_cdr WHERE domain_uuid = '$id'");

                //delete recording
                pg_query($con, "DELETE FROM public.v_recordings WHERE domain_uuid = '$id'");

                //delete extension
                pg_query($con, "DELETE FROM public.v_extensions WHERE domain_uuid = '$id'");

                //delete conference
                pg_query($con, "DELETE FROM public.v_conferences WHERE domain_uuid = '$id'");

                //delete destination
                pg_query($con, "DELETE FROM public.v_destinations WHERE domain_uuid = '$id'");

                //delete gateway
                pg_query($con, "DELETE FROM public.v_gateways WHERE domain_uuid = '$id'");

                //delete ivr
                pg_query($con, "DELETE FROM public.v_ivr_menus WHERE domain_uuid = '$id'");
                pg_query($con, "DELETE FROM public.v_ivr_menu_options WHERE domain_uuid = '$id'");

                //delete ring group
                pg_query($con, "DELETE FROM public.v_ring_groups WHERE domain_uuid = '$id'");
                pg_query($con, "DELETE FROM public.v_ring_group_destinations WHERE domain_uuid = '$id'");


                echo json_encode([
                    "message" => "Domain Deleted Successfully !!"
                ]);            
                return;
            } else {
                echo json_encode([
                    "message" => "Failed to Delete Domain, Try Again !!"
                ]);            
                return;
            }
        }

        public function create_domain_variable($con, $domain_id, $domain_name, $userID) {
            $dialplan_id = Uuid::uuid4()->toString();
            $app_uuid = '9f356fe7-8cf8-4c14-8fe2-6daf89304458';

            $dialplan_xml = '
                                <extension name="domain-variables" continue="true" uuid='."$dialplan_id".'>
                                    <condition field="" expression="">
                                        <action application="export" data="origination_callee_id_name=${caller_destination}"/>
                                        <action application="set" data="operator=1000" inline="true"/>
                                    </condition>
                                </extension>
                            ';
            $insertQuery = "INSERT INTO public.v_dialplans (app_uuid, dialplan_uuid, domain_uuid, dialplan_context, dialplan_name, dialplan_continue, dialplan_order, dialplan_xml, dialplan_enabled, dialplan_description, insert_user) VALUES ('$app_uuid', '$dialplan_id', '$domain_id', '$domain_name', 'domain-variables', 'true', '020', '$dialplan_xml', 'true', '$domain_name', '$userID')";
            $resultQuery = pg_query($con, $insertQuery);

            if ($resultQuery) {
                $dialplan_detail_tags = ['condition', 'action', 'action'];
                $dialplan_detail_types = ['', 'export', 'set'];
                $dialplan_detail_datas = ['', 'origination_callee_id_name=${caller_destination}', 'operator=1000'];

                // Loop through the arrays and call the API
                $dialplan_detail_order = 5;
                for ($i = 0; $i < 3; $i++) {
                    $uuidSetting = Uuid::uuid4()->toString(); // Generate new UUID for each iteration

                    // Get values from arrays
                    $dialplan_detail_tag = $dialplan_detail_tags[$i % count($dialplan_detail_tags)];
                    $dialplan_detail_type = $dialplan_detail_types[$i % count($dialplan_detail_types)];
                    $dialplan_detail_data = $dialplan_detail_datas[$i % count($dialplan_detail_datas)];
                    $dialplan_detail_group = 0;

                    $insertQueueSecondSettings = "INSERT INTO public.v_dialplan_details (dialplan_detail_uuid, dialplan_uuid, domain_uuid, dialplan_detail_tag, dialplan_detail_type, dialplan_detail_data, dialplan_detail_group, dialplan_detail_order, dialplan_detail_enabled, insert_user) VALUES ('$uuidSetting', '$dialplan_id', '$domain_id', '$dialplan_detail_tag', '$dialplan_detail_type', '$dialplan_detail_data', '$dialplan_detail_group', '$dialplan_detail_order', 'true', '$userID')";
                    $resultQueueSecondSettings = pg_query($con, $insertQueueSecondSettings);
                    $dialplan_detail_order += 5;
                }
            }
        }
        
        public function create_call_limit($con, $domain_id, $domain_name, $userID) {
            $dialplan_id = Uuid::uuid4()->toString();
            $app_uuid = '4670c44c-45dd-4bae-97ba-b0dfe0aca639';

            $dialplan_xml = '
                            <extension name="call-limit" continue="true" uuid='."$dialplan_id".'>
                                <condition field="${call_direction}" expression="^(inbound|outbound)$">
                                    <action application="limit" data="hash inbound ${domain_uuid} ${max_calls} !USER_BUSY"/>
                                </condition>
                            </extension>
                            ';
            $insertQuery = "INSERT INTO public.v_dialplans (app_uuid, dialplan_uuid, domain_uuid, dialplan_context, dialplan_name, dialplan_continue, dialplan_order, dialplan_xml, dialplan_enabled, dialplan_description, insert_user) VALUES ('$app_uuid', '$dialplan_id', '$domain_id', '$domain_name', 'call-limit', 'true', '025', '$dialplan_xml', 'true', '$domain_name', '$userID')";
            $resultQuery = pg_query($con, $insertQuery);

            if ($resultQuery) {
                $dialplan_detail_tags = ['condition', 'action'];
                $dialplan_detail_types = ['${call_direction}', 'limit'];
                $dialplan_detail_datas = ['^(inbound|outbound)$', 'hash inbound ${domain_uuid} ${max_calls} !USER_BUSY'];

                // Loop through the arrays and call the API
                $dialplan_detail_order = 5;
                for ($i = 0; $i < 2; $i++) {
                    $uuidSetting = Uuid::uuid4()->toString(); // Generate new UUID for each iteration

                    // Get values from arrays
                    $dialplan_detail_tag = $dialplan_detail_tags[$i % count($dialplan_detail_tags)];
                    $dialplan_detail_type = $dialplan_detail_types[$i % count($dialplan_detail_types)];
                    $dialplan_detail_data = $dialplan_detail_datas[$i % count($dialplan_detail_datas)];
                    $dialplan_detail_group = 0;

                    $dialplan_id = $dialplan_id; 
                    $insertQueueSecondSettings = "INSERT INTO public.v_dialplan_details (dialplan_detail_uuid, dialplan_uuid, domain_uuid, dialplan_detail_tag, dialplan_detail_type, dialplan_detail_data, dialplan_detail_group, dialplan_detail_order, dialplan_detail_enabled, insert_user) VALUES ('$uuidSetting', '$dialplan_id', '$domain_id', '$dialplan_detail_tag', '$dialplan_detail_type', '$dialplan_detail_data', '$dialplan_detail_group', '$dialplan_detail_order', 'true', '$userID')";
                    $resultQueueSecondSettings = pg_query($con, $insertQueueSecondSettings);
                    $dialplan_detail_order += 5;
                }
            }
        }

        public function create_call_block($con, $domain_id, $domain_name, $userID) {
            $dialplan_id = Uuid::uuid4()->toString();
            $app_uuid = 'b1b31930-d0ee-4395-a891-04df94599f1f';

            $dialplan_xml = '
                            <extension name="call_block" continue="true" uuid='."$dialplan_id".'>
                                <condition field="${call_direction}" expression="^(inbound|outbound)$">
                                    <action application="lua" data="app.lua call_block"/>
                                </condition>
                            </extension>
                            ';
            $insertQuery = "INSERT INTO public.v_dialplans (app_uuid, dialplan_uuid, domain_uuid, dialplan_context, dialplan_name, dialplan_continue, dialplan_order, dialplan_xml, dialplan_enabled, dialplan_description, insert_user) VALUES ('$app_uuid', '$dialplan_id', '$domain_id', '$domain_name', 'call_block', 'true', '040', '$dialplan_xml', 'true', '$domain_name', '$userID')";
            $resultQuery = pg_query($con, $insertQuery);

            if ($resultQuery) {
                $dialplan_detail_tags = ['condition', 'action'];
                $dialplan_detail_types = ['${call_direction}', 'lua'];
                $dialplan_detail_datas = ['^(inbound|outbound)$', 'app.lua call_block'];

                // Loop through the arrays and call the API
                $dialplan_detail_order = 5;
                for ($i = 0; $i < 2; $i++) {
                    $uuidSetting = Uuid::uuid4()->toString(); // Generate new UUID for each iteration

                    // Get values from arrays
                    $dialplan_detail_tag = $dialplan_detail_tags[$i % count($dialplan_detail_tags)];
                    $dialplan_detail_type = $dialplan_detail_types[$i % count($dialplan_detail_types)];
                    $dialplan_detail_data = $dialplan_detail_datas[$i % count($dialplan_detail_datas)];
                    $dialplan_detail_group = 0;

                    $dialplan_id = $dialplan_id; 
                    $insertQueueSecondSettings = "INSERT INTO public.v_dialplan_details (dialplan_detail_uuid, dialplan_uuid, domain_uuid, dialplan_detail_tag, dialplan_detail_type, dialplan_detail_data, dialplan_detail_group, dialplan_detail_order, dialplan_detail_enabled, insert_user) VALUES ('$uuidSetting', '$dialplan_id', '$domain_id', '$dialplan_detail_tag', '$dialplan_detail_type', '$dialplan_detail_data', '$dialplan_detail_group', '$dialplan_detail_order', 'true', '$userID')";
                    $resultQueueSecondSettings = pg_query($con, $insertQueueSecondSettings);
                    $dialplan_detail_order += 5;
                }
            }
        }

        public function create_call_recording_on_demand($con, $domain_id, $domain_name, $userID) {
            $dialplan_id = Uuid::uuid4()->toString();
            $app_uuid = 'b1b31930-d0ee-4395-a891-04df94599f1f';

            $dialplan_xml = '
                            <extension name="call_recording_on_demand" continue="true" uuid='."$dialplan_id".'>
                                <condition field="${sip_authorized}" expression="true" break="never">
                                    <action application="set" data="bind_target=both" inline="true"/>
                                    <anti-action application="set" data="bind_target=peer" inline="true"/>
                                </condition>
                                <condition field="" expression="">
                                    <action application="bind_digit_action" data="local,*2,exec:record_session,${recordings_dir}/${domain_name}/archive/${strftime(%Y)}/${strftime(%b)}/${strftime(%d)}/${uuid}.${record_ext},${bind_target}"/>
                                    <action application="digit_action_set_realm" data="local"/>
                                    <action application="bind_digit_action" data="local,*5,api:uuid_record,${uuid} mask ${recordings_dir}/${domain_name}/archive/${strftime(%Y)}/${strftime(%b)}/${strftime(%d)}/${uuid}.${record_ext},${bind_target}"/>
                                    <action application="bind_digit_action" data="local,*6,api:uuid_record,${uuid} unmask ${recordings_dir}/${domain_name}/archive/${strftime(%Y)}/${strftime(%b)}/${strftime(%d)}/${uuid}.${record_ext},${bind_target}"/>
                                </condition>
                            </extension>
                            ';
            $insertQuery = "INSERT INTO public.v_dialplans (app_uuid, dialplan_uuid, domain_uuid, dialplan_context, dialplan_name, dialplan_continue, dialplan_order, dialplan_xml, dialplan_enabled, dialplan_description, insert_user) VALUES ('$app_uuid', '$dialplan_id', '$domain_id', '$domain_name', 'call_recording_on_demand', 'true', '045', '$dialplan_xml', 'true', '$domain_name', '$userID')";
            $resultQuery = pg_query($con, $insertQuery);

            if ($resultQuery) {
                $dialplan_detail_tags = ['condition', 'action', 'anti-action'];
                $dialplan_detail_types = ['${sip_authorized}', 'set', 'set'];
                $dialplan_detail_datas = ['true', 'bind_target=both', 'bind_target=peer'];

                // Loop through the arrays and call the API
                $dialplan_detail_order = 5;
                for ($i = 0; $i < 3; $i++) {
                    $uuidSetting = Uuid::uuid4()->toString(); // Generate new UUID for each iteration

                    // Get values from arrays
                    $dialplan_detail_tag = $dialplan_detail_tags[$i % count($dialplan_detail_tags)];
                    $dialplan_detail_type = $dialplan_detail_types[$i % count($dialplan_detail_types)];
                    $dialplan_detail_data = $dialplan_detail_datas[$i % count($dialplan_detail_datas)];
                    $dialplan_detail_group = 0;

                    $dialplan_id = $dialplan_id; 
                    $insertQueueSecondSettings = "INSERT INTO public.v_dialplan_details (dialplan_detail_uuid, dialplan_uuid, domain_uuid, dialplan_detail_tag, dialplan_detail_type, dialplan_detail_data, dialplan_detail_group, dialplan_detail_order, dialplan_detail_enabled, insert_user) VALUES ('$uuidSetting', '$dialplan_id', '$domain_id', '$dialplan_detail_tag', '$dialplan_detail_type', '$dialplan_detail_data', '$dialplan_detail_group', '$dialplan_detail_order', 'true', '$userID')";
                    $resultQueueSecondSettings = pg_query($con, $insertQueueSecondSettings);
                    $dialplan_detail_order += 5;
                }

                $dialplan_detail_tags_other = ['condition', 'action', 'action', 'action', 'action'];
                $dialplan_detail_types_other = ['', 'bind_digit_action', 'bind_digit_set_realm', 'bind_digit_action', 'bind_digit_action'];
                $dialplan_detail_datas_other = ['', 'local,*2,exec:record_session,$${recordings_dir}/${domain_name}/archive/${strftime(%Y)}/${strftime(%b)}/${strftime(%d)}/${uuid}.${record_ext},${bind_target}', 'local', 'local,*5,api:uuid_record,${uuid} mask ${recordings_dir}/${domain_name}/archive/${strftime(%Y)}/${strftime(%b)}/${strftime(%d)}/${uuid}.${record_ext},${bind_target}', 'local,*6,api:uuid_record,${uuid} unmask ${recordings_dir}/${domain_name}/archive/${strftime(%Y)}/${strftime(%b)}/${strftime(%d)}/${uuid}.${record_ext},${bind_target}'];

                // Loop through the arrays and call the API
                $dialplan_detail_order_other = 25;
                for ($i = 0; $i < 5; $i++) {
                    $uuidSetting = Uuid::uuid4()->toString(); // Generate new UUID for each iteration

                    // Get values from arrays
                    $dialplan_detail_tag_other = $dialplan_detail_tags_other[$i % count($dialplan_detail_tags_other)];
                    $dialplan_detail_type_other = $dialplan_detail_types_other[$i % count($dialplan_detail_types_other)];
                    $dialplan_detail_data_other = $dialplan_detail_datas_other[$i % count($dialplan_detail_datas_other)];
                    $dialplan_detail_group_other = 1;

                    $insertQueueThirdSettings = "INSERT INTO public.v_dialplan_details (dialplan_detail_uuid, dialplan_uuid, domain_uuid, dialplan_detail_tag, dialplan_detail_type, dialplan_detail_data, dialplan_detail_group, dialplan_detail_order, dialplan_detail_enabled, insert_user) VALUES ('$uuidSetting', '$dialplan_id', '$domain_id', '$dialplan_detail_tag_other', '$dialplan_detail_type_other', '$dialplan_detail_data_other', '$dialplan_detail_group_other', '$dialplan_detail_order_other', 'true', '$userID')";
                    $resultQueueThirdSettings = pg_query($con, $insertQueueThirdSettings);
                    $dialplan_detail_order_other += 5;
                }
            }
        }
        
        public function create_speed_dial($con, $domain_id, $domain_name, $userID) {
            $dialplan_id = Uuid::uuid4()->toString();
            $app_uuid = '1a4a2611-01e3-4582-982b-4ada4d314ea3';

            $dialplan_xml = '
                            <extension name="speed_dial" continue="false" uuid='."$dialplan_id".'>
                                <condition field="destination_number" expression="^\*0(.*)$">
                                    <action application="set" data="permissions=false"/>
                                    <action application="lua" data="app.lua speed_dial $1"/>
                                </condition>
                            </extension>
                            ';
            $insertQuery = "INSERT INTO public.v_dialplans (app_uuid, dialplan_uuid, domain_uuid, dialplan_context, dialplan_name, dialplan_number, dialplan_continue, dialplan_order, dialplan_xml, dialplan_enabled, dialplan_description, insert_user) VALUES ('$app_uuid', '$dialplan_id', '$domain_id', '$domain_name', 'speed_dial', '*0[ext]', 'true', '070', '$dialplan_xml', 'true', '$domain_name', '$userID')";
            $resultQuery = pg_query($con, $insertQuery);

            if ($resultQuery) {
                $dialplan_detail_tags = ['condition', 'action', 'action'];
                $dialplan_detail_types = ['destination_number', 'set', 'lua'];
                $dialplan_detail_datas = ['^\*0(.*)$', 'permissions=false', 'app.lua speed_dial $1'];

                // Loop through the arrays and call the API
                $dialplan_detail_order = 5;
                for ($i = 0; $i < 3; $i++) {
                    $uuidSetting = Uuid::uuid4()->toString(); // Generate new UUID for each iteration

                    // Get values from arrays
                    $dialplan_detail_tag = $dialplan_detail_tags[$i % count($dialplan_detail_tags)];
                    $dialplan_detail_type = $dialplan_detail_types[$i % count($dialplan_detail_types)];
                    $dialplan_detail_data = $dialplan_detail_datas[$i % count($dialplan_detail_datas)];
                    $dialplan_detail_group = 0;

                    $dialplan_id = $dialplan_id; 
                    $insertQueueSecondSettings = "INSERT INTO public.v_dialplan_details (dialplan_detail_uuid, dialplan_uuid, domain_uuid, dialplan_detail_tag, dialplan_detail_type, dialplan_detail_data, dialplan_detail_group, dialplan_detail_order, dialplan_detail_enabled, insert_user) VALUES ('$uuidSetting', '$dialplan_id', '$domain_id', '$dialplan_detail_tag', '$dialplan_detail_type', '$dialplan_detail_data', '$dialplan_detail_group', '$dialplan_detail_order', 'true', '$userID')";
                    $resultQueueSecondSettings = pg_query($con, $insertQueueSecondSettings);
                    $dialplan_detail_order += 5;
                }
            }
        }

        public function create_user_hold_music($con, $domain_id, $domain_name, $userID) {
            $dialplan_id = Uuid::uuid4()->toString();
            $app_uuid = '3ace0990-ef23-45b2-a81d-a5857a671e74';

            $dialplan_xml = '
                            <extension name="user_hold_music" continue="true" uuid='."$dialplan_id".'>
                                <condition field="${user_exists}" expression="true"/>
                                <condition field="${hold_music}" expression="^$"/>
                                <condition field="${from_user_exists}" expression="false">
                                    <action application="set" data="hold_music=${user_data ${destination_number}@${domain_name} var hold_music}" inline="true"/>
                                </condition>
                            </extension>
                            ';
            $insertQuery = "INSERT INTO public.v_dialplans (app_uuid, dialplan_uuid, domain_uuid, dialplan_context, dialplan_name, dialplan_continue, dialplan_order, dialplan_xml, dialplan_enabled, dialplan_description, insert_user) VALUES ('$app_uuid', '$dialplan_id', '$domain_id', '$domain_name', 'user_hold_music', 'true', '080', '$dialplan_xml', 'true', '$domain_name', '$userID')";
            $resultQuery = pg_query($con, $insertQuery);

            if ($resultQuery) {
                $dialplan_detail_tags = ['condition', 'condition', 'condition', 'action'];
                $dialplan_detail_types = ['${user_exists}', '${hold_music}', '${from_user_exists}' ,'set'];
                $dialplan_detail_datas = ['true', '^$', 'false', 'hold_music=${user_data ${destination_number}@${domain_name} var hold_music}'];

                // Loop through the arrays and call the API
                $dialplan_detail_order = 5;
                for ($i = 0; $i < 4; $i++) {
                    $uuidSetting = Uuid::uuid4()->toString(); // Generate new UUID for each iteration

                    // Get values from arrays
                    $dialplan_detail_tag = $dialplan_detail_tags[$i % count($dialplan_detail_tags)];
                    $dialplan_detail_type = $dialplan_detail_types[$i % count($dialplan_detail_types)];
                    $dialplan_detail_data = $dialplan_detail_datas[$i % count($dialplan_detail_datas)];
                    $dialplan_detail_group = 0;

                    $dialplan_id = $dialplan_id; 
                    $insertQueueSecondSettings = "INSERT INTO public.v_dialplan_details (dialplan_detail_uuid, dialplan_uuid, domain_uuid, dialplan_detail_tag, dialplan_detail_type, dialplan_detail_data, dialplan_detail_group, dialplan_detail_order, dialplan_detail_enabled, insert_user) VALUES ('$uuidSetting', '$dialplan_id', '$domain_id', '$dialplan_detail_tag', '$dialplan_detail_type', '$dialplan_detail_data', '$dialplan_detail_group', '$dialplan_detail_order', 'true', '$userID')";
                    $resultQueueSecondSettings = pg_query($con, $insertQueueSecondSettings);
                    $dialplan_detail_order += 5;
                }
            }
        }

        public function create_distinctive_ring_local($con, $domain_id, $domain_name, $userID) {
            $dialplan_id = Uuid::uuid4()->toString();
            $app_uuid = '7564fed9-1345-4022-a355-f1ddd2ad4b5c';

            $dialplan_xml = '
                            <extension name="distinctive-ring-local" continue="true" uuid='."$dialplan_id".'>
                                <condition field="${call_direction}" expression="^local$">
                                    <action application="set" data="sip_h_Alert-Info=3" inline="true"/>
                                </condition>
                            </extension>
                            ';
            $insertQuery = "INSERT INTO public.v_dialplans (app_uuid, dialplan_uuid, domain_uuid, dialplan_context, dialplan_name, dialplan_continue, dialplan_order, dialplan_xml, dialplan_enabled, dialplan_description, insert_user) VALUES ('$app_uuid', '$dialplan_id', '$domain_id', '$domain_name', 'distinctive-ring-local', 'true', '130', '$dialplan_xml', 'true', '$domain_name', '$userID')";
            $resultQuery = pg_query($con, $insertQuery);

            if ($resultQuery) {
                $dialplan_detail_tags = ['condition', 'action'];
                $dialplan_detail_types = ['${call_direction}', 'set'];
                $dialplan_detail_datas = ['^local$', 'sip_h_Alert-Info=3'];

                // Loop through the arrays and call the API
                $dialplan_detail_order = 5;
                for ($i = 0; $i < 2; $i++) {
                    $uuidSetting = Uuid::uuid4()->toString(); // Generate new UUID for each iteration

                    // Get values from arrays
                    $dialplan_detail_tag = $dialplan_detail_tags[$i % count($dialplan_detail_tags)];
                    $dialplan_detail_type = $dialplan_detail_types[$i % count($dialplan_detail_types)];
                    $dialplan_detail_data = $dialplan_detail_datas[$i % count($dialplan_detail_datas)];
                    $dialplan_detail_group = 0;

                    $dialplan_id = $dialplan_id; 
                    $insertQueueSecondSettings = "INSERT INTO public.v_dialplan_details (dialplan_detail_uuid, dialplan_uuid, domain_uuid, dialplan_detail_tag, dialplan_detail_type, dialplan_detail_data, dialplan_detail_group, dialplan_detail_order, dialplan_detail_enabled, insert_user) VALUES ('$uuidSetting', '$dialplan_id', '$domain_id', '$dialplan_detail_tag', '$dialplan_detail_type', '$dialplan_detail_data', '$dialplan_detail_group', '$dialplan_detail_order', 'true', '$userID')";
                    $resultQueueSecondSettings = pg_query($con, $insertQueueSecondSettings);
                    $dialplan_detail_order += 5;
                }
            }
        }

        public function create_provision($con, $domain_id, $domain_name, $userID) {
            $dialplan_id = Uuid::uuid4()->toString();
            $app_uuid = 'd31d267d-7235-4887-a01b-d59f3a1dfcca';

            $dialplan_xml = '
                            <extension name="provision" continue="false" uuid='."$dialplan_id".'>
                                <condition field="destination_number" expression="^\*11$" break="on-true">
                                    <action application="set" data="reboot=true"/>
                                    <action application="set" data="action=login"/>
                                    <action application="lua" data="app.lua provision"/>
                                </condition>
                                <condition field="destination_number" expression="^\*12$">
                                    <action application="set" data="reboot=true"/>
                                    <action application="set" data="action=logout"/>
                                    <action application="lua" data="app.lua provision"/>
                                </condition>
                            </extension>
                            ';
            $insertQuery = "INSERT INTO public.v_dialplans (app_uuid, dialplan_uuid, domain_uuid, dialplan_context, dialplan_name, dialplan_number, dialplan_continue, dialplan_order, dialplan_xml, dialplan_enabled, dialplan_description, insert_user) VALUES ('$app_uuid', '$dialplan_id', '$domain_id', '$domain_name', 'provision', '*11,*12', 'true', '220', '$dialplan_xml', 'true', '$domain_name', '$userID')";
            $resultQuery = pg_query($con, $insertQuery);

            if ($resultQuery) {
                $dialplan_detail_tags = ['condition', 'action', 'action', 'action'];
                $dialplan_detail_types = ['destination_number', 'set', 'set', 'set'];
                $dialplan_detail_datas = ['^\*11$', 'reboot=true', 'action=login', 'app.lua provision'];

                // Loop through the arrays and call the API
                $dialplan_detail_order = 5;
                for ($i = 0; $i < 4; $i++) {
                    $uuidSetting = Uuid::uuid4()->toString(); // Generate new UUID for each iteration

                    // Get values from arrays
                    $dialplan_detail_tag = $dialplan_detail_tags[$i % count($dialplan_detail_tags)];
                    $dialplan_detail_type = $dialplan_detail_types[$i % count($dialplan_detail_types)];
                    $dialplan_detail_data = $dialplan_detail_datas[$i % count($dialplan_detail_datas)];
                    $dialplan_detail_group = 0;

                    $dialplan_id = $dialplan_id; 
                    $insertQueueSecondSettings = "INSERT INTO public.v_dialplan_details (dialplan_detail_uuid, dialplan_uuid, domain_uuid, dialplan_detail_tag, dialplan_detail_type, dialplan_detail_data, dialplan_detail_group, dialplan_detail_order, dialplan_detail_enabled, insert_user) VALUES ('$uuidSetting', '$dialplan_id', '$domain_id', '$dialplan_detail_tag', '$dialplan_detail_type', '$dialplan_detail_data', '$dialplan_detail_group', '$dialplan_detail_order', 'true', '$userID')";
                    $resultQueueSecondSettings = pg_query($con, $insertQueueSecondSettings);
                    $dialplan_detail_order += 5;
                }

                $dialplan_detail_tags_other = ['condition', 'action', 'action', 'action'];
                $dialplan_detail_types_other = ['destination_number', 'set', 'set', 'lua'];
                $dialplan_detail_datas_other = ['^\*12$', 'reboot=true', 'action=logout', 'app.lua provision'];

                // Loop through the arrays and call the API
                $dialplan_detail_order_other = 30;
                for ($i = 0; $i < 4; $i++) {
                    $uuidSetting = Uuid::uuid4()->toString(); // Generate new UUID for each iteration

                    // Get values from arrays
                    $dialplan_detail_tag_other = $dialplan_detail_tags_other[$i % count($dialplan_detail_tags_other)];
                    $dialplan_detail_type_other = $dialplan_detail_types_other[$i % count($dialplan_detail_types_other)];
                    $dialplan_detail_data_other = $dialplan_detail_datas_other[$i % count($dialplan_detail_datas_other)];
                    $dialplan_detail_group_other = 1;

                    $insertQueueThirdSettings = "INSERT INTO public.v_dialplan_details (dialplan_detail_uuid, dialplan_uuid, domain_uuid, dialplan_detail_tag, dialplan_detail_type, dialplan_detail_data, dialplan_detail_group, dialplan_detail_order, dialplan_detail_enabled, insert_user) VALUES ('$uuidSetting', '$dialplan_id', '$domain_id', '$dialplan_detail_tag_other', '$dialplan_detail_type_other', '$dialplan_detail_data_other', '$dialplan_detail_group_other', '$dialplan_detail_order_other', 'true', '$userID')";
                    $resultQueueThirdSettings = pg_query($con, $insertQueueThirdSettings);
                    $dialplan_detail_order_other += 5;
                }
            }
        }

        public function create_group_intercept($con, $domain_id, $domain_name, $userID) {
            $dialplan_id = Uuid::uuid4()->toString();
            $app_uuid = 'd31d267d-7235-4887-a01b-d59f3a1dfcca';

            $dialplan_xml = '
                            <extension name="group-intercept" continue="false" uuid='."$dialplan_id".'>
                                <condition field="destination_number" expression="^\*8$"/>
                                <condition field="${sip_h_X-intercept_uuid}" expression="^(.+)$" break="on-true">
                                    <action application="intercept" data="$1"/>
                                </condition>
                                <condition field="" expression="">
                                    <action application="answer" data=""/>
                                    <action application="lua" data="intercept_group.lua inbound"/>
                                </condition>
                            </extension>
                            ';
            $insertQuery = "INSERT INTO public.v_dialplans (app_uuid, dialplan_uuid, domain_uuid, dialplan_context, dialplan_name, dialplan_number, dialplan_continue, dialplan_order, dialplan_xml, dialplan_enabled, dialplan_description, insert_user) VALUES ('$app_uuid', '$dialplan_id', '$domain_id', '$domain_name', 'group-intercept', '*8', 'true', '230', '$dialplan_xml', 'true', '$domain_name', '$userID')";
            $resultQuery = pg_query($con, $insertQuery);

            if ($resultQuery) {
                $dialplan_detail_tags = ['condition', 'action', 'action'];
                $dialplan_detail_types = ['destination_number', '${sip_h_X-intercept_uuid}', 'intercept'];
                $dialplan_detail_datas = ['^\*8$', '^(.+)$', '$1'];

                // Loop through the arrays and call the API
                $dialplan_detail_order = 5;
                for ($i = 0; $i < 3; $i++) {
                    $uuidSetting = Uuid::uuid4()->toString(); // Generate new UUID for each iteration

                    // Get values from arrays
                    $dialplan_detail_tag = $dialplan_detail_tags[$i % count($dialplan_detail_tags)];
                    $dialplan_detail_type = $dialplan_detail_types[$i % count($dialplan_detail_types)];
                    $dialplan_detail_data = $dialplan_detail_datas[$i % count($dialplan_detail_datas)];
                    $dialplan_detail_group = 0;

                    $dialplan_id = $dialplan_id; 
                    $insertQueueSecondSettings = "INSERT INTO public.v_dialplan_details (dialplan_detail_uuid, dialplan_uuid, domain_uuid, dialplan_detail_tag, dialplan_detail_type, dialplan_detail_data, dialplan_detail_group, dialplan_detail_order, dialplan_detail_enabled, insert_user) VALUES ('$uuidSetting', '$dialplan_id', '$domain_id', '$dialplan_detail_tag', '$dialplan_detail_type', '$dialplan_detail_data', '$dialplan_detail_group', '$dialplan_detail_order', 'true', '$userID')";
                    $resultQueueSecondSettings = pg_query($con, $insertQueueSecondSettings);
                    $dialplan_detail_order += 5;
                }

                $dialplan_detail_tags_other = ['condition', 'action', 'action'];
                $dialplan_detail_types_other = ['', 'answer', 'lua'];
                $dialplan_detail_datas_other = ['', '', 'intercept_group.lua inbound'];

                // Loop through the arrays and call the API
                $dialplan_detail_order_other = 25;
                for ($i = 0; $i < 3; $i++) {
                    $uuidSetting = Uuid::uuid4()->toString(); // Generate new UUID for each iteration

                    // Get values from arrays
                    $dialplan_detail_tag_other = $dialplan_detail_tags_other[$i % count($dialplan_detail_tags_other)];
                    $dialplan_detail_type_other = $dialplan_detail_types_other[$i % count($dialplan_detail_types_other)];
                    $dialplan_detail_data_other = $dialplan_detail_datas_other[$i % count($dialplan_detail_datas_other)];
                    $dialplan_detail_group_other = 1;

                    $insertQueueThirdSettings = "INSERT INTO public.v_dialplan_details (dialplan_detail_uuid, dialplan_uuid, domain_uuid, dialplan_detail_tag, dialplan_detail_type, dialplan_detail_data, dialplan_detail_group, dialplan_detail_order, dialplan_detail_enabled, insert_user) VALUES ('$uuidSetting', '$dialplan_id', '$domain_id', '$dialplan_detail_tag_other', '$dialplan_detail_type_other', '$dialplan_detail_data_other', '$dialplan_detail_group_other', '$dialplan_detail_order_other', 'true', '$userID')";
                    $resultQueueThirdSettings = pg_query($con, $insertQueueThirdSettings);
                    $dialplan_detail_order_other += 5;
                }
            }
        }

        public function create_page($con, $domain_id, $domain_name, $userID) {
            $dialplan_id = Uuid::uuid4()->toString();
            $app_uuid = '2011c518-696d-4878-a9b2-b217b6311311';

            $dialplan_xml = '
                            <extension name="page" continue="false" uuid='."$dialplan_id".'>
                                <condition field="destination_number" expression="^\*724$">
                                    <action application="set" data="caller_id_name=Page"/>
                                    <action application="set" data="caller_id_number="/>
                                    <action application="set" data="pin_number=06814679"/>
                                    <action application="set" data="destinations=101-103,105"/>
                                    <action application="set" data="moderator=false"/>
                                    <action application="set" data="mute=true"/>
                                    <action application="lua" data="page.lua"/>
                                </condition>
                            </extension>
                            ';
            $insertQuery = "INSERT INTO public.v_dialplans (app_uuid, dialplan_uuid, domain_uuid, dialplan_context, dialplan_name, dialplan_number, dialplan_continue, dialplan_order, dialplan_xml, dialplan_enabled, dialplan_description, insert_user) VALUES ('$app_uuid', '$dialplan_id', '$domain_id', '$domain_name', 'page', '*724', 'true', '240', '$dialplan_xml', 'true', '$domain_name', '$userID')";
            $resultQuery = pg_query($con, $insertQuery);

            if ($resultQuery) {
                $dialplan_detail_tags = ['condition', 'action', 'action', 'action', 'action', 'action', 'action', 'action', 'action', 'action', 'action'];
                $dialplan_detail_types = ['destination_number', 'set', 'set', 'set', 'set', 'set', 'set', 'set', 'set', 'set', 'set'];
                $dialplan_detail_datas = ['^\*724$', 'caller_id_name=Page', 'caller_id_number=', 'pin_number=06814679', 'destinations=101-103,105', 'moderator=false', 'mute=true', 'check_destination_status=true', 'api_hangup_hook=conference page-${destination_number}@${domain_name} hup all', 'execute_on_answer=sched_hangup +80 allotted_timeout', 'page.lua'];

                // Loop through the arrays and call the API
                $dialplan_detail_order = 5;
                for ($i = 0; $i < 11; $i++) {
                    $uuidSetting = Uuid::uuid4()->toString(); // Generate new UUID for each iteration

                    // Get values from arrays
                    $dialplan_detail_tag = $dialplan_detail_tags[$i % count($dialplan_detail_tags)];
                    $dialplan_detail_type = $dialplan_detail_types[$i % count($dialplan_detail_types)];
                    $dialplan_detail_data = $dialplan_detail_datas[$i % count($dialplan_detail_datas)];
                    $dialplan_detail_group = 0;

                    $dialplan_id = $dialplan_id; 
                    $insertQueueSecondSettings = "INSERT INTO public.v_dialplan_details (dialplan_detail_uuid, dialplan_uuid, domain_uuid, dialplan_detail_tag, dialplan_detail_type, dialplan_detail_data, dialplan_detail_group, dialplan_detail_order, dialplan_detail_enabled, insert_user) VALUES ('$uuidSetting', '$dialplan_id', '$domain_id', '$dialplan_detail_tag', '$dialplan_detail_type', '$dialplan_detail_data', '$dialplan_detail_group', '$dialplan_detail_order', 'true', '$userID')";
                    $resultQueueSecondSettings = pg_query($con, $insertQueueSecondSettings);
                    $dialplan_detail_order += 5;
                }
            }
        }

        public function create_page_extension($con, $domain_id, $domain_name, $userID) {
            $dialplan_id = Uuid::uuid4()->toString();
            $app_uuid = '1b224444-de8b-448d-b2d1-19feaac3effa';

            $dialplan_xml = '
                            <extension name="page-extension" continue="false" uuid='."$dialplan_id".'>
                                <condition field="destination_number" expression="^\*8(\d{2,7})$">
                                    <action application="set" data="destinations=$1"/>
                                    <action application="set" data="pin_number=46187961"/>
                                    <action application="set" data="mute=true"/>
                                    <action application="set" data="moderator=false"/>
                                    <action application="lua" data="page.lua"/>
                                </condition>
                            </extension>
                            ';
            $insertQuery = "INSERT INTO public.v_dialplans (app_uuid, dialplan_uuid, domain_uuid, dialplan_context, dialplan_name, dialplan_number, dialplan_continue, dialplan_order, dialplan_xml, dialplan_enabled, dialplan_description, insert_user) VALUES ('$app_uuid', '$dialplan_id', '$domain_id', '$domain_name', 'page-extension', '*8[ext]', 'true', '250', '$dialplan_xml', 'true', '$domain_name', '$userID')";
            $resultQuery = pg_query($con, $insertQuery);

            if ($resultQuery) {
                $dialplan_detail_tags = ['condition', 'action', 'action', 'action', 'action', 'action'];
                $dialplan_detail_types = ['destination_number', 'set', 'set', 'set', 'set', 'lua'];
                $dialplan_detail_datas = ['^\*8(\d{2,7})$', 'destinations=$1', 'pin_number=46187961', 'mute=true', 'moderator=false', 'page.lua'];

                // Loop through the arrays and call the API
                $dialplan_detail_order = 5;
                for ($i = 0; $i < 6; $i++) {
                    $uuidSetting = Uuid::uuid4()->toString(); // Generate new UUID for each iteration

                    // Get values from arrays
                    $dialplan_detail_tag = $dialplan_detail_tags[$i % count($dialplan_detail_tags)];
                    $dialplan_detail_type = $dialplan_detail_types[$i % count($dialplan_detail_types)];
                    $dialplan_detail_data = $dialplan_detail_datas[$i % count($dialplan_detail_datas)];
                    $dialplan_detail_group = 0;

                    $dialplan_id = $dialplan_id; 
                    $insertQueueSecondSettings = "INSERT INTO public.v_dialplan_details (dialplan_detail_uuid, dialplan_uuid, domain_uuid, dialplan_detail_tag, dialplan_detail_type, dialplan_detail_data, dialplan_detail_group, dialplan_detail_order, dialplan_detail_enabled, insert_user) VALUES ('$uuidSetting', '$dialplan_id', '$domain_id', '$dialplan_detail_tag', '$dialplan_detail_type', '$dialplan_detail_data', '$dialplan_detail_group', '$dialplan_detail_order', 'true', '$userID')";
                    $resultQueueSecondSettings = pg_query($con, $insertQueueSecondSettings);
                    $dialplan_detail_order += 5;
                }
            }
        }

        public function create_eavesdrop($con, $domain_id, $domain_name, $userID) {
            $dialplan_id = Uuid::uuid4()->toString();
            $app_uuid = 'e944af7e-8fcc-429b-a32f-0dcdce1585d8';

            $dialplan_xml = '
                            <extension name="eavesdrop" continue="false" uuid='."$dialplan_id".'>
                                <condition field="destination_number" expression="^\*33(\d{2,7})$">
                                    <action application="answer" data=""/>
                                    <action application="set" data="pin_number=59272344"/>
                                    <action application="lua" data="eavesdrop.lua $1"/>
                                </condition>
                            </extension>
                            ';
            $insertQuery = "INSERT INTO public.v_dialplans (app_uuid, dialplan_uuid, domain_uuid, dialplan_context, dialplan_name, dialplan_number, dialplan_continue, dialplan_order, dialplan_xml, dialplan_enabled, dialplan_description, insert_user) VALUES ('$app_uuid', '$dialplan_id', '$domain_id', '$domain_name', 'eavesdrop', '*33[ext]', 'true', '260', '$dialplan_xml', 'true', '$domain_name', '$userID')";
            $resultQuery = pg_query($con, $insertQuery);

            if ($resultQuery) {
                $dialplan_detail_tags = ['condition', 'action', 'action', 'action'];
                $dialplan_detail_types = ['destination_number', 'answer', 'set', 'lua'];
                $dialplan_detail_datas = ['^\*33(\d{2,7})$', '', 'pin_number=59272344', 'eavesdrop.lua $1'];

                // Loop through the arrays and call the API
                $dialplan_detail_order = 5;
                for ($i = 0; $i < 4; $i++) {
                    $uuidSetting = Uuid::uuid4()->toString(); // Generate new UUID for each iteration

                    // Get values from arrays
                    $dialplan_detail_tag = $dialplan_detail_tags[$i % count($dialplan_detail_tags)];
                    $dialplan_detail_type = $dialplan_detail_types[$i % count($dialplan_detail_types)];
                    $dialplan_detail_data = $dialplan_detail_datas[$i % count($dialplan_detail_datas)];
                    $dialplan_detail_group = 0;

                    $dialplan_id = $dialplan_id; 
                    $insertQueueSecondSettings = "INSERT INTO public.v_dialplan_details (dialplan_detail_uuid, dialplan_uuid, domain_uuid, dialplan_detail_tag, dialplan_detail_type, dialplan_detail_data, dialplan_detail_group, dialplan_detail_order, dialplan_detail_enabled, insert_user) VALUES ('$uuidSetting', '$dialplan_id', '$domain_id', '$dialplan_detail_tag', '$dialplan_detail_type', '$dialplan_detail_data', '$dialplan_detail_group', '$dialplan_detail_order', 'true', '$userID')";
                    $resultQueueSecondSettings = pg_query($con, $insertQueueSecondSettings);
                    $dialplan_detail_order += 5;
                }
            }
        }

        public function create_intercept_ext($con, $domain_id, $domain_name, $userID) {
            $dialplan_id = Uuid::uuid4()->toString();
            $app_uuid = '2b7b2f82-edfe-4339-8cc5-7d0cf36e1e68';

            $dialplan_xml = '
                            <extension name="intercept-ext" continue="false" uuid='."$dialplan_id".'>
                                <condition field="destination_number" expression="^\*\*(\d+)$" break="on-true">
                                    <action application="answer" data=""/>
                                    <action application="lua" data="intercept.lua $1"/>
                                </condition>
                                <condition field="destination_number" expression="^\*\*$"/>
                                <condition field="${sip_h_X-intercept_uuid}" expression="^(.+)$" break="on-true">
                                    <action application="intercept" data="$1"/>
                                </condition>
                            </extension>
                            ';
            $insertQuery = "INSERT INTO public.v_dialplans (app_uuid, dialplan_uuid, domain_uuid, dialplan_context, dialplan_name, dialplan_number, dialplan_continue, dialplan_order, dialplan_xml, dialplan_enabled, dialplan_description, insert_user) VALUES ('$app_uuid', '$dialplan_id', '$domain_id', '$domain_name', 'intercept-ext', '**[ext]', 'true', '290', '$dialplan_xml', 'true', '$domain_name', '$userID')";
            $resultQuery = pg_query($con, $insertQuery);

            if ($resultQuery) {
                $dialplan_detail_tags = ['condition', 'action', 'action'];
                $dialplan_detail_types = ['destination_number', 'answer', 'lua'];
                $dialplan_detail_datas = ['^\*\*(\d+)$', '', 'intercept.lua $1'];

                // Loop through the arrays and call the API
                $dialplan_detail_order = 5;
                for ($i = 0; $i < 3; $i++) {
                    $uuidSetting = Uuid::uuid4()->toString(); // Generate new UUID for each iteration

                    // Get values from arrays
                    $dialplan_detail_tag = $dialplan_detail_tags[$i % count($dialplan_detail_tags)];
                    $dialplan_detail_type = $dialplan_detail_types[$i % count($dialplan_detail_types)];
                    $dialplan_detail_data = $dialplan_detail_datas[$i % count($dialplan_detail_datas)];
                    $dialplan_detail_group = 0;

                    $dialplan_id = $dialplan_id; 
                    $insertQueueSecondSettings = "INSERT INTO public.v_dialplan_details (dialplan_detail_uuid, dialplan_uuid, domain_uuid, dialplan_detail_tag, dialplan_detail_type, dialplan_detail_data, dialplan_detail_group, dialplan_detail_order, dialplan_detail_enabled, insert_user) VALUES ('$uuidSetting', '$dialplan_id', '$domain_id', '$dialplan_detail_tag', '$dialplan_detail_type', '$dialplan_detail_data', '$dialplan_detail_group', '$dialplan_detail_order', 'true', '$userID')";
                    $resultQueueSecondSettings = pg_query($con, $insertQueueSecondSettings);
                    $dialplan_detail_order += 5;
                }

                $dialplan_detail_tags_other = ['condition', 'action', 'action'];
                $dialplan_detail_types_other = ['destination_number', '	${sip_h_X-intercept_uuid}', 'intercept'];
                $dialplan_detail_datas_other = ['^\*\*$', '^(.+)$', '$1'];

                // Loop through the arrays and call the API
                $dialplan_detail_order_other = 25;
                for ($i = 0; $i < 3; $i++) {
                    $uuidSetting = Uuid::uuid4()->toString(); // Generate new UUID for each iteration

                    // Get values from arrays
                    $dialplan_detail_tag_other = $dialplan_detail_tags_other[$i % count($dialplan_detail_tags_other)];
                    $dialplan_detail_type_other = $dialplan_detail_types_other[$i % count($dialplan_detail_types_other)];
                    $dialplan_detail_data_other = $dialplan_detail_datas_other[$i % count($dialplan_detail_datas_other)];
                    $dialplan_detail_group_other = 1;

                    $insertQueueThirdSettings = "INSERT INTO public.v_dialplan_details (dialplan_detail_uuid, dialplan_uuid, domain_uuid, dialplan_detail_tag, dialplan_detail_type, dialplan_detail_data, dialplan_detail_group, dialplan_detail_order, dialplan_detail_enabled, insert_user) VALUES ('$uuidSetting', '$dialplan_id', '$domain_id', '$dialplan_detail_tag_other', '$dialplan_detail_type_other', '$dialplan_detail_data_other', '$dialplan_detail_group_other', '$dialplan_detail_order_other', 'true', '$userID')";
                    $resultQueueThirdSettings = pg_query($con, $insertQueueThirdSettings);
                    $dialplan_detail_order_other += 5;
                }
            }
        }

        public function create_number_queue($con, $domain_id, $domain_name, $userID) {
            $dialplan_id = Uuid::uuid4()->toString();
            $app_uuid = 'eb837d10-890d-11e3-baa8-0800200c9a66';

            $dialplan_xml = '
                            <extension name="page" continue="false" uuid='."$dialplan_id".'>
                                <condition field="destination_number" expression="^\*724$">
                                    <action application="set" data="caller_id_name=Page"/>
                                    <action application="set" data="caller_id_number="/>
                                    <action application="set" data="pin_number=06814679"/>
                                    <action application="set" data="destinations=101-103,105"/>
                                    <action application="set" data="moderator=false"/>
                                    <action application="set" data="mute=true"/>
                                    <action application="lua" data="page.lua"/>
                                </condition>
                            </extension>
                            ';
            $insertQuery = "INSERT INTO public.v_dialplans (app_uuid, dialplan_uuid, domain_uuid, dialplan_context, dialplan_name, dialplan_number, dialplan_continue, dialplan_order, dialplan_xml, dialplan_enabled, dialplan_description, insert_user) VALUES ('$app_uuid', '$dialplan_id', '$domain_id', '$domain_name', 'number_queue', '*800[ext]', 'true', '290', '$dialplan_xml', 'true', '$domain_name', '$userID')";
            $resultQuery = pg_query($con, $insertQuery);

            if ($resultQuery) {
                $dialplan_detail_tags = ['condition', 'action', 'action', 'action', 'action', 'action', 'action', 'action', 'action'];
                $dialplan_detail_types = ['destination_number', 'set', 'set', 'set', 'set', 'set', 'set', 'set', 'lua'];
                $dialplan_detail_datas = ['^\*800(.*)$', 'fifo_music=$${hold_music}', 'extension_queue=queue_$1@${domain_name}', 'fifo_simo=1', 'fifo_timeout=30', 'fifo_lag=10', 'fifo_destroy_after_use=true', 'fifo_extension_member=$1@${domain_name}', 'extension_queue.lua'];

                // Loop through the arrays and call the API
                $dialplan_detail_order = 5;
                for ($i = 0; $i < 9; $i++) {
                    $uuidSetting = Uuid::uuid4()->toString(); // Generate new UUID for each iteration

                    // Get values from arrays
                    $dialplan_detail_tag = $dialplan_detail_tags[$i % count($dialplan_detail_tags)];
                    $dialplan_detail_type = $dialplan_detail_types[$i % count($dialplan_detail_types)];
                    $dialplan_detail_data = $dialplan_detail_datas[$i % count($dialplan_detail_datas)];
                    $dialplan_detail_group = 0;

                    $dialplan_id = $dialplan_id; 
                    $insertQueueSecondSettings = "INSERT INTO public.v_dialplan_details (dialplan_detail_uuid, dialplan_uuid, domain_uuid, dialplan_detail_tag, dialplan_detail_type, dialplan_detail_data, dialplan_detail_group, dialplan_detail_order, dialplan_detail_enabled, insert_user) VALUES ('$uuidSetting', '$dialplan_id', '$domain_id', '$dialplan_detail_tag', '$dialplan_detail_type', '$dialplan_detail_data', '$dialplan_detail_group', '$dialplan_detail_order', 'true', '$userID')";
                    $resultQueueSecondSettings = pg_query($con, $insertQueueSecondSettings);
                    $dialplan_detail_order += 5;
                }
            }
        }

        public function create_recordings($con, $domain_id, $domain_name, $userID) {
            $dialplan_id = Uuid::uuid4()->toString();
            $app_uuid = '430737df-5385-42d1-b933-22600d3fb79e';

            $dialplan_xml = '
                            <extension name="recordings" continue="false" uuid='."$dialplan_id".'>
                                <condition field="destination_number" expression="^\*(732)$">
                                    <action application="answer" data=""/>
                                    <action application="set" data="pin_number=19861476"/>
                                    <action application="set" data="recording_id="/>
                                    <action application="set" data="recording_prefix=recording"/>
                                    <action application="set" data="record_append=false"/>
                                    <action application="lua" data="recordings.lua"/>
                                </condition>
                            </extension>
                            ';
            $insertQuery = "INSERT INTO public.v_dialplans (app_uuid, dialplan_uuid, domain_uuid, dialplan_context, dialplan_name, dialplan_number, dialplan_continue, dialplan_order, dialplan_xml, dialplan_enabled, dialplan_description, insert_user) VALUES ('$app_uuid', '$dialplan_id', '$domain_id', '$domain_name', 'recordings', '*732', 'true', '400', '$dialplan_xml', 'true', '$domain_name', '$userID')";
            $resultQuery = pg_query($con, $insertQuery);

            if ($resultQuery) {
                $dialplan_detail_tags = ['condition', 'action', 'action', 'action', 'action', 'action', 'action'];
                $dialplan_detail_types = ['destination_number', 'answer', 'set', 'set', 'set', 'set', 'lua'];
                $dialplan_detail_datas = ['^\*(732)$', '', 'pin_number=19861476', 'recording_id=', 'recording_prefix=recording', 'record_append=false', 'recordings.lua'];

                // Loop through the arrays and call the API
                $dialplan_detail_order = 5;
                for ($i = 0; $i < 7; $i++) {
                    $uuidSetting = Uuid::uuid4()->toString(); // Generate new UUID for each iteration

                    // Get values from arrays
                    $dialplan_detail_tag = $dialplan_detail_tags[$i % count($dialplan_detail_tags)];
                    $dialplan_detail_type = $dialplan_detail_types[$i % count($dialplan_detail_types)];
                    $dialplan_detail_data = $dialplan_detail_datas[$i % count($dialplan_detail_datas)];
                    $dialplan_detail_group = 0;

                    $dialplan_id = $dialplan_id; 
                    $insertQueueSecondSettings = "INSERT INTO public.v_dialplan_details (dialplan_detail_uuid, dialplan_uuid, domain_uuid, dialplan_detail_tag, dialplan_detail_type, dialplan_detail_data, dialplan_detail_group, dialplan_detail_order, dialplan_detail_enabled, insert_user) VALUES ('$uuidSetting', '$dialplan_id', '$domain_id', '$dialplan_detail_tag', '$dialplan_detail_type', '$dialplan_detail_data', '$dialplan_detail_group', '$dialplan_detail_order', 'true', '$userID')";
                    $resultQueueSecondSettings = pg_query($con, $insertQueueSecondSettings);
                    $dialplan_detail_order += 5;
                }
            }
        }

        public function create_disa($con, $domain_id, $domain_name, $userID) {
            $dialplan_id = Uuid::uuid4()->toString();
            $app_uuid = '3ade2d9a-f55d-4240-bb60-b4a3ab36951c';

            $dialplan_xml = '
                            <extension name="disa" continue="false" uuid='."$dialplan_id".'>
                                <condition field="destination_number" expression="^\*(3472)$">
                                    <action application="answer" data=""/>
                                    <action application="set" data="pin_number=30517625"/>
                                    <action application="set" data="dialplan_context=${context}"/>
                                    <action application="lua" data="disa.lua"/>
                                </condition>
                            </extension>
                            ';
            $insertQuery = "INSERT INTO public.v_dialplans (app_uuid, dialplan_uuid, domain_uuid, dialplan_context, dialplan_name, dialplan_number, dialplan_continue, dialplan_order, dialplan_xml, dialplan_enabled, dialplan_description, insert_user) VALUES ('$app_uuid', '$dialplan_id', '$domain_id', '$domain_name', 'disa', '*3472', 'true', '420', '$dialplan_xml', 'true', '$domain_name', '$userID')";
            $resultQuery = pg_query($con, $insertQuery);

            if ($resultQuery) {
                $dialplan_detail_tags = ['condition', 'action', 'action', 'action', 'action', 'action', 'action', 'action', 'action', 'action', 'action'];
                $dialplan_detail_types = ['destination_number', 'answer', 'set', 'set', 'set', 'set', 'set', 'set', 'set', 'set', 'lua'];
                $dialplan_detail_datas = ['^\*(3472)$', '', 'pin_number=30517625', 'dialplan_context=${context}', 'outbound_caller_id_name=', 'outbound_caller_id_number=', 'predefined_destination=', 'fallback_destination=', 'digit_min_length=', 'digit_max_length=', 'disa.lua'];

                // Loop through the arrays and call the API
                $dialplan_detail_order = 5;
                for ($i = 0; $i < 11; $i++) {
                    $uuidSetting = Uuid::uuid4()->toString(); // Generate new UUID for each iteration

                    // Get values from arrays
                    $dialplan_detail_tag = $dialplan_detail_tags[$i % count($dialplan_detail_tags)];
                    $dialplan_detail_type = $dialplan_detail_types[$i % count($dialplan_detail_types)];
                    $dialplan_detail_data = $dialplan_detail_datas[$i % count($dialplan_detail_datas)];
                    $dialplan_detail_group = 0;

                    $dialplan_id = $dialplan_id; 
                    $insertQueueSecondSettings = "INSERT INTO public.v_dialplan_details (dialplan_detail_uuid, dialplan_uuid, domain_uuid, dialplan_detail_tag, dialplan_detail_type, dialplan_detail_data, dialplan_detail_group, dialplan_detail_order, dialplan_detail_enabled, insert_user) VALUES ('$uuidSetting', '$dialplan_id', '$domain_id', '$dialplan_detail_tag', '$dialplan_detail_type', '$dialplan_detail_data', '$dialplan_detail_group', '$dialplan_detail_order', 'true', '$userID')";
                    $resultQueueSecondSettings = pg_query($con, $insertQueueSecondSettings);
                    $dialplan_detail_order += 5;
                }
            }
        }

        public function create_user_record($con, $domain_id, $domain_name, $userID) {
            $dialplan_id = Uuid::uuid4()->toString();
            $app_uuid = '43539dd3-d555-4498-835a-3245a0b184ca';

            $dialplan_xml = '
                            <extension name="user_record" continue="true" uuid='."$dialplan_id".'>
                                <condition field="${user_exists}" expression="^true$" break="never"/>
                                <condition field="${user_record}" expression="^all$" break="never">
                                    <action application="set" data="record_session=true" inline="true"/>
                                </condition>
                                <condition field="${user_exists}" expression="^true$" break="never"/>
                                <condition field="${call_direction}" expression="^inbound$" break="never"/>
                                <condition field="${user_record}" expression="^inbound$" break="never">
                                    <action application="set" data="record_session=true" inline="true"/>
                                </condition>
                                <condition field="${user_exists}" expression="^true$" break="never"/>
                                <condition field="${call_direction}" expression="^outbound$" break="never"/>
                                <condition field="${user_record}" expression="^outbound$" break="never">
                                    <action application="set" data="record_session=true" inline="true"/>
                                </condition>
                                <condition field="${user_exists}" expression="^true$" break="never"/>
                                <condition field="${call_direction}" expression="^local$" break="never"/>
                                <condition field="${user_record}" expression="^local$" break="never">
                                    <action application="set" data="record_session=true" inline="true"/>
                                </condition>
                                <condition field="${from_user_exists}" expression="^true$" break="never">
                                    <action application="set" data="from_user_record=${user_data ${sip_from_user}@${sip_from_host} var user_record}" inline="true"/>
                                </condition>
                                <condition field="${from_user_exists}" expression="^true$" break="never"/>
                                <condition field="${from_user_record}" expression="^all$" break="never">
                                    <action application="set" data="record_session=true" inline="true"/>
                                </condition>
                                <condition field="${from_user_exists}" expression="^true$" break="never"/>
                                <condition field="${call_direction}" expression="^inbound$" break="never"/>
                                <condition field="${from_user_record}" expression="^inbound$" break="never">
                                    <action application="set" data="record_session=true" inline="true"/>
                                </condition>
                                <condition field="${from_user_exists}" expression="^true$" break="never"/>
                                <condition field="${call_direction}" expression="^outbound$" break="never"/>
                                <condition field="${from_user_record}" expression="^outbound$" break="never">
                                    <action application="set" data="record_session=true" inline="true"/>
                                </condition>
                                <condition field="${from_user_exists}" expression="^true$" break="never"/>
                                <condition field="${call_direction}" expression="^local$" break="never"/>
                                <condition field="${from_user_record}" expression="^local$" break="never">
                                    <action application="set" data="record_session=true" inline="true"/>
                                </condition>
                                <condition field="${record_session}" expression="^true$">
                                    <action application="set" data="record_path=${recordings_dir}/${domain_name}/archive/${strftime(%Y)}/${strftime(%b)}/${strftime(%d)}" inline="true"/>
                                    <action application="set" data="record_name=${uuid}.${record_ext}" inline="true"/>
                                    <action application="mkdir" data="${record_path}"/>
                                    <action application="set" data="recording_follow_transfer=true" inline="true"/>
                                    <action application="bind_digit_action" data="local,*5,api:uuid_record,${uuid} mask ${recordings_dir}/${domain_name}/archive/${strftime(%Y)}/${strftime(%b)}/${strftime(%d)}/${uuid}.${record_ext},both,self"/>
                                    <action application="bind_digit_action" data="local,*6,api:uuid_record,${uuid} unmask ${recordings_dir}/${domain_name}/archive/${strftime(%Y)}/${strftime(%b)}/${strftime(%d)}/${uuid}.${record_ext},both,self"/>
                                    <action application="set" data="record_append=true" inline="true"/>
                                    <action application="set" data="record_in_progress=true" inline="true"/>
                                    <action application="set" data="RECORD_ANSWER_REQ=true"/>
                                    <action application="record_session" data="${record_path}/${record_name}"/>
                                </condition>
                            </extension>
                            ';
            $insertQuery = "INSERT INTO public.v_dialplans (app_uuid, dialplan_uuid, domain_uuid, dialplan_context, dialplan_name, dialplan_continue, dialplan_order, dialplan_xml, dialplan_enabled, dialplan_description, insert_user) VALUES ('$app_uuid', '$dialplan_id', '$domain_id', '$domain_name', 'user_record', 'true', '050', '$dialplan_xml', 'true', '$domain_name', '$userID')";
            $resultQuery = pg_query($con, $insertQuery);

            if ($resultQuery) {
                $dialplan_detail_tags = ['condition', 'condition', 'action'];
                $dialplan_detail_types = ['${user_exists}', '${user_record}', 'set'];
                $dialplan_detail_datas = ['^true$', '^all$', 'record_session=true'];

                // Loop through the arrays and call the API
                $dialplan_detail_order = 5;
                for ($i = 0; $i < 3; $i++) {
                    $uuidSetting = Uuid::uuid4()->toString(); // Generate new UUID for each iteration

                    // Get values from arrays
                    $dialplan_detail_tag = $dialplan_detail_tags[$i % count($dialplan_detail_tags)];
                    $dialplan_detail_type = $dialplan_detail_types[$i % count($dialplan_detail_types)];
                    $dialplan_detail_data = $dialplan_detail_datas[$i % count($dialplan_detail_datas)];
                    $dialplan_detail_group = 0;

                    $dialplan_id = $dialplan_id; 
                    $insertQueueSecondSettings = "INSERT INTO public.v_dialplan_details (dialplan_detail_uuid, dialplan_uuid, domain_uuid, dialplan_detail_tag, dialplan_detail_type, dialplan_detail_data, dialplan_detail_group, dialplan_detail_order, dialplan_detail_enabled, insert_user) VALUES ('$uuidSetting', '$dialplan_id', '$domain_id', '$dialplan_detail_tag', '$dialplan_detail_type', '$dialplan_detail_data', '$dialplan_detail_group', '$dialplan_detail_order', 'true', '$userID')";
                    $resultQueueSecondSettings = pg_query($con, $insertQueueSecondSettings);
                    $dialplan_detail_order += 5;
                }

                $dialplan_detail_tags_other = ['condition', 'condition', 'condition', 'action'];
                $dialplan_detail_types_other = ['${user_exists}', '${call_direction}', '${user_record}', 'set'];
                $dialplan_detail_datas_other = ['^true$', '^inbound$', '^inbound$', 'record_session=true'];

                // Loop through the arrays and call the API
                $dialplan_detail_order_other = 25;
                for ($i = 0; $i < 4; $i++) {
                    $uuidSetting = Uuid::uuid4()->toString(); // Generate new UUID for each iteration

                    // Get values from arrays
                    $dialplan_detail_tag_other = $dialplan_detail_tags_other[$i % count($dialplan_detail_tags_other)];
                    $dialplan_detail_type_other = $dialplan_detail_types_other[$i % count($dialplan_detail_types_other)];
                    $dialplan_detail_data_other = $dialplan_detail_datas_other[$i % count($dialplan_detail_datas_other)];
                    $dialplan_detail_group_other = 1;

                    $insertQueueThirdSettings = "INSERT INTO public.v_dialplan_details (dialplan_detail_uuid, dialplan_uuid, domain_uuid, dialplan_detail_tag, dialplan_detail_type, dialplan_detail_data, dialplan_detail_group, dialplan_detail_order, dialplan_detail_enabled, insert_user) VALUES ('$uuidSetting', '$dialplan_id', '$domain_id', '$dialplan_detail_tag_other', '$dialplan_detail_type_other', '$dialplan_detail_data_other', '$dialplan_detail_group_other', '$dialplan_detail_order_other', 'true', '$userID')";
                    $resultQueueThirdSettings = pg_query($con, $insertQueueThirdSettings);
                    $dialplan_detail_order_other += 5;
                }

                $dialplan_detail_tags_other = ['condition', 'condition', 'condition', 'action'];
                $dialplan_detail_types_other = ['${user_exists}', '${call_direction}', '${user_record}', 'set'];
                $dialplan_detail_datas_other = ['^true$', '^outbound$', '^outbound$', 'record_session=true'];

                // Loop through the arrays and call the API
                $dialplan_detail_order_other = 50;
                for ($i = 0; $i < 4; $i++) {
                    $uuidSetting = Uuid::uuid4()->toString(); // Generate new UUID for each iteration

                    // Get values from arrays
                    $dialplan_detail_tag_other = $dialplan_detail_tags_other[$i % count($dialplan_detail_tags_other)];
                    $dialplan_detail_type_other = $dialplan_detail_types_other[$i % count($dialplan_detail_types_other)];
                    $dialplan_detail_data_other = $dialplan_detail_datas_other[$i % count($dialplan_detail_datas_other)];
                    $dialplan_detail_group_other = 2;

                    $insertQueueThirdSettings = "INSERT INTO public.v_dialplan_details (dialplan_detail_uuid, dialplan_uuid, domain_uuid, dialplan_detail_tag, dialplan_detail_type, dialplan_detail_data, dialplan_detail_group, dialplan_detail_order, dialplan_detail_enabled, insert_user) VALUES ('$uuidSetting', '$dialplan_id', '$domain_id', '$dialplan_detail_tag_other', '$dialplan_detail_type_other', '$dialplan_detail_data_other', '$dialplan_detail_group_other', '$dialplan_detail_order_other', 'true', '$userID')";
                    $resultQueueThirdSettings = pg_query($con, $insertQueueThirdSettings);
                    $dialplan_detail_order_other += 5;
                }

                $dialplan_detail_tags_other = ['condition', 'condition', 'condition', 'action'];
                $dialplan_detail_types_other = ['${user_exists}', '${call_direction}', '${user_record}', 'set'];
                $dialplan_detail_datas_other = ['^true$', '^local$', '^local$', 'record_session=true'];

                // Loop through the arrays and call the API
                $dialplan_detail_order_other = 75;
                for ($i = 0; $i < 4; $i++) {
                    $uuidSetting = Uuid::uuid4()->toString(); // Generate new UUID for each iteration

                    // Get values from arrays
                    $dialplan_detail_tag_other = $dialplan_detail_tags_other[$i % count($dialplan_detail_tags_other)];
                    $dialplan_detail_type_other = $dialplan_detail_types_other[$i % count($dialplan_detail_types_other)];
                    $dialplan_detail_data_other = $dialplan_detail_datas_other[$i % count($dialplan_detail_datas_other)];
                    $dialplan_detail_group_other = 3;

                    $insertQueueThirdSettings = "INSERT INTO public.v_dialplan_details (dialplan_detail_uuid, dialplan_uuid, domain_uuid, dialplan_detail_tag, dialplan_detail_type, dialplan_detail_data, dialplan_detail_group, dialplan_detail_order, dialplan_detail_enabled, insert_user) VALUES ('$uuidSetting', '$dialplan_id', '$domain_id', '$dialplan_detail_tag_other', '$dialplan_detail_type_other', '$dialplan_detail_data_other', '$dialplan_detail_group_other', '$dialplan_detail_order_other', 'true', '$userID')";
                    $resultQueueThirdSettings = pg_query($con, $insertQueueThirdSettings);
                    $dialplan_detail_order_other += 5;
                }

                $dialplan_detail_tags_other = ['condition', 'action'];
                $dialplan_detail_types_other = ['${from_user_exists}', 'set'];
                $dialplan_detail_datas_other = ['^true$', 'from_user_record=${user_data ${sip_from_user}@${sip_from_host} var user_record}'];

                // Loop through the arrays and call the API
                $dialplan_detail_order_other = 100;
                for ($i = 0; $i < 2; $i++) {
                    $uuidSetting = Uuid::uuid4()->toString(); // Generate new UUID for each iteration

                    // Get values from arrays
                    $dialplan_detail_tag_other = $dialplan_detail_tags_other[$i % count($dialplan_detail_tags_other)];
                    $dialplan_detail_type_other = $dialplan_detail_types_other[$i % count($dialplan_detail_types_other)];
                    $dialplan_detail_data_other = $dialplan_detail_datas_other[$i % count($dialplan_detail_datas_other)];
                    $dialplan_detail_group_other = 4;

                    $insertQueueThirdSettings = "INSERT INTO public.v_dialplan_details (dialplan_detail_uuid, dialplan_uuid, domain_uuid, dialplan_detail_tag, dialplan_detail_type, dialplan_detail_data, dialplan_detail_group, dialplan_detail_order, dialplan_detail_enabled, insert_user) VALUES ('$uuidSetting', '$dialplan_id', '$domain_id', '$dialplan_detail_tag_other', '$dialplan_detail_type_other', '$dialplan_detail_data_other', '$dialplan_detail_group_other', '$dialplan_detail_order_other', 'true', '$userID')";
                    $resultQueueThirdSettings = pg_query($con, $insertQueueThirdSettings);
                    $dialplan_detail_order_other += 5;
                }

                $dialplan_detail_tags_other = ['condition', 'condition', 'action'];
                $dialplan_detail_types_other = ['${from_user_exists}', '${from_user_record}', 'set'];
                $dialplan_detail_datas_other = ['^true$', '^all$', 'record_session=true'];

                // Loop through the arrays and call the API
                $dialplan_detail_order_other = 115;
                for ($i = 0; $i < 3; $i++) {
                    $uuidSetting = Uuid::uuid4()->toString(); // Generate new UUID for each iteration

                    // Get values from arrays
                    $dialplan_detail_tag_other = $dialplan_detail_tags_other[$i % count($dialplan_detail_tags_other)];
                    $dialplan_detail_type_other = $dialplan_detail_types_other[$i % count($dialplan_detail_types_other)];
                    $dialplan_detail_data_other = $dialplan_detail_datas_other[$i % count($dialplan_detail_datas_other)];
                    $dialplan_detail_group_other = 5;

                    $insertQueueThirdSettings = "INSERT INTO public.v_dialplan_details (dialplan_detail_uuid, dialplan_uuid, domain_uuid, dialplan_detail_tag, dialplan_detail_type, dialplan_detail_data, dialplan_detail_group, dialplan_detail_order, dialplan_detail_enabled, insert_user) VALUES ('$uuidSetting', '$dialplan_id', '$domain_id', '$dialplan_detail_tag_other', '$dialplan_detail_type_other', '$dialplan_detail_data_other', '$dialplan_detail_group_other', '$dialplan_detail_order_other', 'true', '$userID')";
                    $resultQueueThirdSettings = pg_query($con, $insertQueueThirdSettings);
                    $dialplan_detail_order_other += 5;
                }

                $dialplan_detail_tags_other = ['condition', 'condition', 'condition', 'action'];
                $dialplan_detail_types_other = ['${from_user_exists}', '${call_direction}', '${from_user_record}', 'set'];
                $dialplan_detail_datas_other = ['^true$', '^inbound$', '^inbound$', 'record_session=true'];

                // Loop through the arrays and call the API
                $dialplan_detail_order_other = 135;
                for ($i = 0; $i < 4; $i++) {
                    $uuidSetting = Uuid::uuid4()->toString(); // Generate new UUID for each iteration

                    // Get values from arrays
                    $dialplan_detail_tag_other = $dialplan_detail_tags_other[$i % count($dialplan_detail_tags_other)];
                    $dialplan_detail_type_other = $dialplan_detail_types_other[$i % count($dialplan_detail_types_other)];
                    $dialplan_detail_data_other = $dialplan_detail_datas_other[$i % count($dialplan_detail_datas_other)];
                    $dialplan_detail_group_other = 6;

                    $insertQueueThirdSettings = "INSERT INTO public.v_dialplan_details (dialplan_detail_uuid, dialplan_uuid, domain_uuid, dialplan_detail_tag, dialplan_detail_type, dialplan_detail_data, dialplan_detail_group, dialplan_detail_order, dialplan_detail_enabled, insert_user) VALUES ('$uuidSetting', '$dialplan_id', '$domain_id', '$dialplan_detail_tag_other', '$dialplan_detail_type_other', '$dialplan_detail_data_other', '$dialplan_detail_group_other', '$dialplan_detail_order_other', 'true', '$userID')";
                    $resultQueueThirdSettings = pg_query($con, $insertQueueThirdSettings);
                    $dialplan_detail_order_other += 5;
                }

                $dialplan_detail_tags_other = ['condition', 'condition', 'condition', 'action'];
                $dialplan_detail_types_other = ['${from_user_exists}', '${call_direction}', '${from_user_record}', 'set'];
                $dialplan_detail_datas_other = ['^true$', '^outbound$', '^outbound$', 'record_session=true'];

                // Loop through the arrays and call the API
                $dialplan_detail_order_other = 160;
                for ($i = 0; $i < 4; $i++) {
                    $uuidSetting = Uuid::uuid4()->toString(); // Generate new UUID for each iteration

                    // Get values from arrays
                    $dialplan_detail_tag_other = $dialplan_detail_tags_other[$i % count($dialplan_detail_tags_other)];
                    $dialplan_detail_type_other = $dialplan_detail_types_other[$i % count($dialplan_detail_types_other)];
                    $dialplan_detail_data_other = $dialplan_detail_datas_other[$i % count($dialplan_detail_datas_other)];
                    $dialplan_detail_group_other = 7;

                    $insertQueueThirdSettings = "INSERT INTO public.v_dialplan_details (dialplan_detail_uuid, dialplan_uuid, domain_uuid, dialplan_detail_tag, dialplan_detail_type, dialplan_detail_data, dialplan_detail_group, dialplan_detail_order, dialplan_detail_enabled, insert_user) VALUES ('$uuidSetting', '$dialplan_id', '$domain_id', '$dialplan_detail_tag_other', '$dialplan_detail_type_other', '$dialplan_detail_data_other', '$dialplan_detail_group_other', '$dialplan_detail_order_other', 'true', '$userID')";
                    $resultQueueThirdSettings = pg_query($con, $insertQueueThirdSettings);
                    $dialplan_detail_order_other += 5;
                }

                $dialplan_detail_tags_other = ['condition', 'condition', 'condition', 'action'];
                $dialplan_detail_types_other = ['${from_user_exists}', '${call_direction}', '${from_user_record}', 'set'];
                $dialplan_detail_datas_other = ['^true$', '^local$', '^local$', 'record_session=true'];

                // Loop through the arrays and call the API
                $dialplan_detail_order_other = 185;
                for ($i = 0; $i < 4; $i++) {
                    $uuidSetting = Uuid::uuid4()->toString(); // Generate new UUID for each iteration

                    // Get values from arrays
                    $dialplan_detail_tag_other = $dialplan_detail_tags_other[$i % count($dialplan_detail_tags_other)];
                    $dialplan_detail_type_other = $dialplan_detail_types_other[$i % count($dialplan_detail_types_other)];
                    $dialplan_detail_data_other = $dialplan_detail_datas_other[$i % count($dialplan_detail_datas_other)];
                    $dialplan_detail_group_other = 8;

                    $insertQueueThirdSettings = "INSERT INTO public.v_dialplan_details (dialplan_detail_uuid, dialplan_uuid, domain_uuid, dialplan_detail_tag, dialplan_detail_type, dialplan_detail_data, dialplan_detail_group, dialplan_detail_order, dialplan_detail_enabled, insert_user) VALUES ('$uuidSetting', '$dialplan_id', '$domain_id', '$dialplan_detail_tag_other', '$dialplan_detail_type_other', '$dialplan_detail_data_other', '$dialplan_detail_group_other', '$dialplan_detail_order_other', 'true', '$userID')";
                    $resultQueueThirdSettings = pg_query($con, $insertQueueThirdSettings);
                    $dialplan_detail_order_other += 5;
                }

                $dialplan_detail_tags = ['condition', 'action', 'action', 'action', 'action', 'action', 'action', 'action', 'action', 'action', 'action', 'action'];
                $dialplan_detail_types = ['${record_session}', 'set', 'set', 'mkdir', 'set', 'bind_digit_action', 'bind_digit_action', 'set', 'set', 'set', 'set', 'record_session'];
                $dialplan_detail_datas = ['^true$', 'record_path=${recordings_dir}/${domain_name}/archive/${strftime(%Y)}/${strftime(%b)}/${strftime(%d)}', 'record_name=${uuid}.${record_ext}', '${record_path}', 'recording_follow_transfer=true', 'local,*5,api:uuid_record,${uuid} mask ${recordings_dir}/${domain_name}/archive/${strftime(%Y)}/${strftime(%b)}/${strftime(%d)}/${uuid}.${record_ext},both,self', 'local,*6,api:uuid_record,${uuid} unmask ${recordings_dir}/${domain_name}/archive/${strftime(%Y)}/${strftime(%b)}/${strftime(%d)}/${uuid}.${record_ext},both,self', 'record_append=true', 'record_in_progress=true', 'api_on_answer=uuid_record ${uuid} start ${record_path}/${record_name}', 'RECORD_ANSWER_REQ=true', '${record_path}/${record_name}'];

                // Loop through the arrays and call the API
                $dialplan_detail_order = 210;
                for ($i = 0; $i < 12; $i++) {
                    $uuidSetting = Uuid::uuid4()->toString(); // Generate new UUID for each iteration

                    // Get values from arrays
                    $dialplan_detail_tag = $dialplan_detail_tags[$i % count($dialplan_detail_tags)];
                    $dialplan_detail_type = $dialplan_detail_types[$i % count($dialplan_detail_types)];
                    $dialplan_detail_data = $dialplan_detail_datas[$i % count($dialplan_detail_datas)];
                    $dialplan_detail_group = 9;

                    $dialplan_id = $dialplan_id; 
                    $insertQueueSecondSettings = "INSERT INTO public.v_dialplan_details (dialplan_detail_uuid, dialplan_uuid, domain_uuid, dialplan_detail_tag, dialplan_detail_type, dialplan_detail_data, dialplan_detail_group, dialplan_detail_order, dialplan_detail_enabled, insert_user) VALUES ('$uuidSetting', '$dialplan_id', '$domain_id', '$dialplan_detail_tag', '$dialplan_detail_type', '$dialplan_detail_data', '$dialplan_detail_group', '$dialplan_detail_order', 'true', '$userID')";
                    $resultQueueSecondSettings = pg_query($con, $insertQueueSecondSettings);
                    $dialplan_detail_order += 5;
                }
            }
        }
    }
?>
