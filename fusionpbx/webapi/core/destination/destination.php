<?php
    require("../../config/config.php");
    require("../../vendor/autoload.php");
    
    use Ramsey\Uuid\Uuid;

    class Destination {

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
            $query = 'SELECT * FROM public.v_destinations';
            $result = pg_query($con, $query);
            return $result;
        }

        public function fetch_destination_by_id($con, $id) {
            $query = "SELECT * FROM public.v_destinations WHERE destination_uuid ='$id'";
            $result = pg_query($con, $query);
            return $result;
        }

        public function fetch_by_domain($con, $id) {
            $query = "SELECT * FROM public.v_destinations WHERE domain_uuid ='$id'";
            $result = pg_query($con, $query);
            return $result;
        }

        public function post($con, $type, $destination_number, $caller_id_name, $caller_id_number, $destination_condition, $destination_action, $domain, $user, $description, $destination_enabled, $uuidDestination, $userID, $destination_prefix, $api_type = 'add') {
            if (empty(trim($type))) {
               $type = 'inbound';
            }

            if (empty(trim($destination_number))) {
                echo json_encode([
                    "msg"     => 'Destination Number cannot be EMPTY !'
                ]);
                return;
            } elseif (empty(trim($domain))) {
                echo json_encode([
                    "msg"     => 'Please Select Domain !'
                ]);
                return;
            }

            $json_destination = (array) array();
            $destination_number_regex = "^(".$destination_number.")$";

            if ($destination_condition == "") {
                $destination_condition = 'null';
            }

            if ($destination_action == "") {
                $destination_action = 'null';
            }

            $insert_keys = "destination_uuid, domain_uuid, destination_type, destination_number, destination_number_regex, destination_caller_id_name, destination_caller_id_number, destination_conditions, destination_context, destination_order, destination_description, destination_enabled, insert_user, destination_prefix";

            $insert_values = "'$uuidDestination', '$domain', '$type', '$destination_number', '$destination_number_regex', '$caller_id_name', '$caller_id_number', '$destination_condition', 'public', 100, '$description', '$destination_enabled', '$userID', '$destination_prefix'";


            if ($destination_action != "") {
                $insert_keys .= " ,destination_actions ";
                $insert_values .= " ,'$destination_action' ";
            } 

            if ($user != "") {
                $insert_keys .= " ,user_uuid ";
                $insert_values .= " ,'$user' ";
            }

            $insertDestination = "INSERT INTO public.v_destinations ($insert_keys) VALUES ($insert_values)";

            $resultDestination = pg_query($con, $insertDestination);
            if ($resultDestination) {

                if ($type == 'inbound') {

                    $destination_data_dialplan = $json_destination[0]->destination_data;
                    $destination_app = $json_destination[0]->destination_app;

                    $fetchDomain = "SELECT * FROM public.v_domains WHERE domain_uuid = '$domain'";
                    $resultFetchDomain = pg_query($con, $fetchDomain);
                    if (pg_num_rows($resultFetchDomain) > 0) {
                        $rowDomain = pg_fetch_assoc($resultFetchDomain); 
                        $domain_name = $rowDomain['domain_name'];
                        $dialplan_destination_id = $this->create_dialplan_inbound($con, $domain, $domain_name,$destination_app, $destination_data_dialplan, $destination_number, $userID,$destination_prefix);

                        $updateDestinationDialplan = "UPDATE public.v_destinations SET 
                        dialplan_uuid = '$dialplan_destination_id'
                        WHERE destination_uuid = '$uuidDestination'";
                        pg_query($con, $updateDestinationDialplan);
                    }
                }

                if($api_type == 'add'){
                    echo json_encode([
                        "msg"     => 'Destination Created Successfully !!',
                        "destination_number"      => $destination_number,
                        "id"      => $uuidDestination
                    ]);
                    return;
                }else{
                    return array(
                        "msg"     => 'Destination Created Successfully !!',
                        "destination_number"      => $destination_number,
                        "id"      => $uuidDestination
                    );
                }
                
                
            } else {
                // echo json_encode([

                //     "msg"     => 'Failed to Create Destination, Try Again !!'
                // ]);
                return;
            }    
        }

        public function update($con, $type, $destination_ids, $domain, $destination_prefix, $userID){
            if (empty(trim($type))) {
                echo json_encode([
                    "msg"     => 'Type cannot be EMPTY !'
                ]);
                return;
            } 

            $json_destination = (array) array();

            $editQuery = "UPDATE public.v_destinations ";
            $editQuery .= "SET destination_type = '$type', domain_uuid = '$domain' ";
            $editQuery .= "WHERE destination_uuid IN ($destination_ids)";

            $edit = pg_query($con, $editQuery);

            if ($edit) {

                if ($type == 'inbound') {
                    $selectDestinationUuidQuery = "SELECT destination_uuid, dialplan_uuid, destination_number FROM public.v_destinations WHERE destination_uuid IN ($destination_ids)";
                    $destinationUuidResult = pg_query($con, $selectDestinationUuidQuery);
                    $destinationUuidList = array();
                    $destinationList = array();
        
                    while ($row = pg_fetch_assoc($destinationUuidResult)) {
                        $destinationUuidList[] = $row['dialplan_uuid'];
                        $destinationList[] = [
                            'destination_number' => $row['destination_number'],
                            'destination_uuid' => $row['destination_uuid'],
                        ];
                    }
        
                    if (!empty($destinationUuidList)) {
                        $destination_uuids_string = implode(',', $destinationUuidList);

                        $queryDeleteDialplan = "DELETE FROM public.v_dialplans WHERE dialplan_uuid IN ($destination_uuids_string)";
                        pg_query($con, $queryDeleteDialplan);

                        $queryDeleteDialplan = "DELETE FROM public.v_dialplan_details WHERE dialplan_uuid IN ($destination_uuids_string)";
                        pg_query($con, $queryDeleteDialplan);

                        $destination_data_dialplan = $json_destination[0]->destination_data;
                        $destination_app = $json_destination[0]->destination_app;

                        $fetchDomain = "SELECT * FROM public.v_domains WHERE domain_uuid = '$domain'";
                        $resultFetchDomain = pg_query($con, $fetchDomain);

                        $dialplans_details_insert_values = array();
                        $dialplans_insert_values = array();
                        $destinations_update_query = "UPDATE public.v_destinations SET dialplan_uuid = CASE ";

                        if (pg_num_rows($resultFetchDomain) > 0) {
                            $rowDomain = pg_fetch_assoc($resultFetchDomain); 
                            $domain_name = $rowDomain['domain_name'];

                            foreach ($destinationList as &$destination) {
                                $temp = $this->create_values_dialplan_inbound($con, $domain, $domain_name, $destination_app, $destination_data_dialplan, $destination['destination_number'], $userID, $destination_prefix);
                                $dialplans_insert_values[] = $temp['dialplans_insert_values'];
                                $dialplans_details_insert_values = array_merge($dialplans_details_insert_values, $temp['dialplans_details_insert_values']);
                                
                                $destination_uuid = $destination['destination_uuid'];
                                $dialplan_id = $temp['dialplan_id'];
                                $destinations_update_query .= "WHEN destination_uuid = '$destination_uuid' THEN CAST('$dialplan_id' AS UUID) ";
                            }

                            $destinations_update_query .= "END WHERE destination_uuid IN ($destination_ids)";

                            $dialpad_insert_query = "INSERT INTO public.v_dialplans (dialplan_uuid, app_uuid, domain_uuid, dialplan_context, dialplan_name, dialplan_number, dialplan_continue, dialplan_order, dialplan_xml, dialplan_enabled, dialplan_description, insert_user) VALUES ";
                            $dialpad_insert_query .= implode(',', $dialplans_insert_values);
                
                            $query_result = pg_query($con, $dialpad_insert_query);

                            if ($query_result) {
                                $dialpad_details_insert_query = "INSERT INTO public.v_dialplan_details (dialplan_detail_uuid, dialplan_uuid, domain_uuid, dialplan_detail_tag, dialplan_detail_type, dialplan_detail_data, dialplan_detail_group, dialplan_detail_order, dialplan_detail_enabled, insert_user) VALUES ";
                                $dialpad_details_insert_query .= implode(',', $dialplans_details_insert_values);

                                $query_result = pg_query($con, $dialpad_details_insert_query);

                                $query_result = pg_query($con, $destinations_update_query);
                            }

                            if (!$query_result) {
                                echo json_encode([
                                    "msg"     => 'Failed to Update Destination, Try Again !!',
                                ]);
                                return;
                            }
                        }
                    }
                }

                echo json_encode([
                    "msg"     => 'Destination Updated Successfully !!'
                ]);
                return;
            } else {
                echo json_encode([
                    "msg"     => 'Failed to Update Destination, Try Again !!'
                ]);
                return;
            }
        }

        public function delete($con, $ids) {
            $query = "DELETE FROM public.v_destinations WHERE destination_uuid in ($ids)";

            $result = pg_query($con, $query);
            if ($result) {

                $selectDestinationUuidQuery = "SELECT destination_uuid, dialplan_uuid, destination_number FROM public.v_destinations WHERE destination_uuid IN ($ids)";
                $destinationUuidResult = pg_query($con, $selectDestinationUuidQuery);
                $destinationUuidList = array();
        
                while ($row = pg_fetch_assoc($destinationUuidResult)) {
                    $destinationUuidList[] = $row['dialplan_uuid'];
                }
        
                if (!empty($destinationUuidList)) {
                    $destination_uuids_string = implode(',', $destinationUuidList);
                    
                    $queryDeleteDialplan = "DELETE FROM public.v_dialplans WHERE dialplan_uuid IN ($destination_uuids_string)";
                    pg_query($con, $queryDeleteDialplan);

                    $queryDeleteDialplan = "DELETE FROM public.v_dialplan_details WHERE dialplan_uuid IN ($destination_uuids_string)";
                    pg_query($con, $queryDeleteDialplan);
                }
                echo json_encode([
                    "message" => "Destination Deleted Successfully !!"
                ]);            
                return;
            
            } else {
                echo json_encode([
                    "message" => "Failed to Delete Destination, Try Again !!"
                ]);            
                return;
            }
        }

        public function create_values_dialplan_inbound($con, $domain_id, $domain_name, $destination_app, $destination_data, $destination_number, $userID, $destination_prefix) {
            $dialplan_id = Uuid::uuid4()->toString();
            $app_uuid = 'c03b422e-13a8-bd1b-e42b-b6b9b4d27ce4';

            $dialplan["dialplan_xml"] = "<extension name=\"".$destination_number."\" continue=\"false\" uuid=\"".$dialplan_id."\">\n";

            $destination_number_regex = '^\+?'.$destination_prefix.'?('.$destination_number.')$';

            $dialplan["dialplan_xml"] .= "  <condition field=\"destination_number\" expression=\"".$destination_number_regex."\">\n";
            $dialplan["dialplan_xml"] .= "      <action application=\"export\" data=\"call_direction=inbound\" inline=\"true\"/>\n";
            $dialplan["dialplan_xml"] .= "      <action application=\"set\" data=\"domain_uuid=".$domain_id."\" inline=\"true\"/>\n";
            $dialplan["dialplan_xml"] .= "      <action application=\"set\" data=\"domain_name=".$domain_name."\" inline=\"true\"/>\n";
            
            if (!empty($destination_app) && $destination_app == 'bridge') {
                    $dialplan["dialplan_xml"] .= "      <action application=\"set\" data=\"presence_id=\$1@".$domain_name."\" inline=\"true\"/>\n";
                    $dialplan["dialplan_xml"] .= "      <action application=\"set\" data=\"hangup_after_bridge=true\" inline=\"true\"/>\n";
                    $dialplan["dialplan_xml"] .= "      <action application=\"set\" data=\"continue_on_fail=true\" inline=\"true\"/>\n";
            }

            $dialplan["dialplan_xml"] .= "  </condition>\n";
            $dialplan["dialplan_xml"] .= "</extension>\n";


            $dialplan_xml = $dialplan["dialplan_xml"];
            $dialplans_insert_values = "('$dialplan_id', '$app_uuid', '$domain_id', 'public', '$destination_number', '$destination_number', 'false', '100', '$dialplan_xml', 'true', '$domain_name', '$userID')";
            // $resultQuery = pg_query($con, $insertQuery);

            $dialplans_details_insert_values = array();

            // if ($resultQuery) {
            $dialplan_regex = "^(".$destination_number.")$";
            $dialplan_detail_tags = ['condition', 'action'];
            $dialplan_detail_types = ['destination_number', 'transfer'];
            $dialplan_detail_datas = [$dialplan_regex, $destination_data];
            // Loop through the arrays and call the API
            $dialplan_detail_order = 20;

            for ($i = 0; $i < 2; $i++) {
                $uuidSetting = Uuid::uuid4()->toString(); // Generate new UUID for each iteration
                // Get values from arrays
                $dialplan_detail_tag = $dialplan_detail_tags[$i % count($dialplan_detail_tags)];
                $dialplan_detail_type = $dialplan_detail_types[$i % count($dialplan_detail_types)];
                $dialplan_detail_data = $dialplan_detail_datas[$i % count($dialplan_detail_datas)];
                $dialplan_detail_group = 0;
                // $dialplan_id = $dialplan_id;
                $dialplans_details_insert_values[] = "('$uuidSetting', '$dialplan_id', '$domain_id', '$dialplan_detail_tag', '$dialplan_detail_type', '$dialplan_detail_data', '$dialplan_detail_group', '$dialplan_detail_order', 'true', '$userID')";
                // $resultQueueSecondSettings = pg_query($con, $insertQueueSecondSettings);
                $dialplan_detail_order += 20;
            }

            // }
            return [
                'dialplan_id' => $dialplan_id,
                'destination_number' => $destination_number,
                'dialplans_insert_values' => $dialplans_insert_values,
                'dialplans_details_insert_values' => $dialplans_details_insert_values,
            ];
        }

        public function create_dialplan_inbound($con, $domain_id, $domain_name, $destination_app, $destination_data, $destination_number, $userID, $destination_prefix) {
            $dialplan_id = Uuid::uuid4()->toString();
            $app_uuid = 'c03b422e-13a8-bd1b-e42b-b6b9b4d27ce4';
            $destination_record = false;


            //build the xml dialplan
            $dialplan["dialplan_xml"] = "<extension name=\"".$destination_number."\" continue=\"false\" uuid=\"".$dialplan_id."\">\n";

            //add the dialplan xml destination conditions
            // if (!empty($conditions)) {
            //     foreach($conditions as $row) {
            //         if (is_numeric($row['condition_expression']) && strlen($destination_number) == strlen($row['condition_expression']) && !empty($destination_prefix)) {
            //             $condition_expression = '\+?'.$destination_prefix.'?'.$row['condition_expression'];
            //         }
            //         else {
            //             $condition_expression = str_replace("+", "\+", $row['condition_expression']);
            //         }
            //         $dialplan["dialplan_xml"] .= "  <condition regex=\"all\" break=\"never\">\n";
            //         $dialplan["dialplan_xml"] .= "      <regex field=\"".$dialplan_detail_type."\" expression=\"".xml::sanitize($destination_number_regex)."\"/>\n";
            //         $dialplan["dialplan_xml"] .= "      <regex field=\"".xml::sanitize($row['condition_field'])."\" expression=\"^".xml::sanitize($condition_expression)."$\"/>\n";
            //         $dialplan["dialplan_xml"] .= "      <action application=\"export\" data=\"call_direction=inbound\" inline=\"true\"/>\n";
            //         $dialplan["dialplan_xml"] .= "      <action application=\"set\" data=\"domain_uuid=".$_SESSION['domain_uuid']."\" inline=\"true\"/>\n";
            //         $dialplan["dialplan_xml"] .= "      <action application=\"set\" data=\"domain_name=".$_SESSION['domain_name']."\" inline=\"true\"/>\n";
            //         if (!empty($provider_uuid)) {
            //             $dialplan["dialplan_xml"] .= "      <action application=\"set\" data=\"provider_uuid=".xml::sanitize($provider_uuid)."\" inline=\"true\"/>\n";
            //         }
            //         if (isset($row['condition_app']) && !empty($row['condition_app'])) {
            //             if ($destination->valid($row['condition_app'].':'.$row['condition_data'])) {
            //                 $dialplan["dialplan_xml"] .= "      <action application=\"".xml::sanitize($row['condition_app'])."\" data=\"".xml::sanitize($row['condition_data'])."\"/>\n";
            //             }
            //         }
            //         $dialplan["dialplan_xml"] .= "  </condition>\n";
            //     }
            // }

            $destination_number_regex = '^\+?'.$destination_prefix.'?('.$destination_number.')$';

            $dialplan["dialplan_xml"] .= "  <condition field=\"destination_number\" expression=\"".$destination_number_regex."\">\n";
            $dialplan["dialplan_xml"] .= "      <action application=\"export\" data=\"call_direction=inbound\" inline=\"true\"/>\n";
            $dialplan["dialplan_xml"] .= "      <action application=\"set\" data=\"domain_uuid=".$domain_id."\" inline=\"true\"/>\n";
            $dialplan["dialplan_xml"] .= "      <action application=\"set\" data=\"domain_name=".$domain_name."\" inline=\"true\"/>\n";
            
            //add this only if using application bridge
            if (!empty($destination_app) && $destination_app == 'bridge') {
                    $dialplan["dialplan_xml"] .= "      <action application=\"set\" data=\"presence_id=\$1@".$domain_name."\" inline=\"true\"/>\n";
                    $dialplan["dialplan_xml"] .= "      <action application=\"set\" data=\"hangup_after_bridge=true\" inline=\"true\"/>\n";
                    $dialplan["dialplan_xml"] .= "      <action application=\"set\" data=\"continue_on_fail=true\" inline=\"true\"/>\n";
            }

            // if (!empty($destination_cid_name_prefix)) {
            //     $dialplan["dialplan_xml"] .= "      <action application=\"set\" data=\"effective_caller_id_name=".xml::sanitize($destination_cid_name_prefix)."#\${caller_id_name}\" inline=\"true\"/>\n";
            // }
            if (!empty($destination_record) && $destination_record == 'true') {
                $dialplan["dialplan_xml"] .= "      <action application=\"set\" data=\"record_path=\${recordings_dir}/\${domain_name}/archive/\${strftime(%Y)}/\${strftime(%b)}/\${strftime(%d)}\" inline=\"true\"/>\n";
                $dialplan["dialplan_xml"] .= "      <action application=\"set\" data=\"record_name=\${uuid}.\${record_ext}\" inline=\"true\"/>\n";
                $dialplan["dialplan_xml"] .= "      <action application=\"set\" data=\"record_append=true\" inline=\"true\"/>\n";
                $dialplan["dialplan_xml"] .= "      <action application=\"set\" data=\"record_in_progress=true\" inline=\"true\"/>\n";
                $dialplan["dialplan_xml"] .= "      <action application=\"set\" data=\"recording_follow_transfer=true\" inline=\"true\"/>\n";
                $dialplan["dialplan_xml"] .= "      <action application=\"record_session\" data=\"\${record_path}/\${record_name}\" inline=\"false\"/>\n";
            }
            // if (!empty($destination_hold_music)) {
            //     $dialplan["dialplan_xml"] .= "      <action application=\"export\" data=\"hold_music=".xml::sanitize($destination_hold_music)."\" inline=\"true\"/>\n";
            // }
            // if (!empty($destination_distinctive_ring)) {
            //     $dialplan["dialplan_xml"] .= "      <action application=\"export\" data=\"sip_h_Alert-Info=".xml::sanitize($destination_distinctive_ring)."\" inline=\"true\"/>\n";
            // }
            // if (!empty($destination_accountcode)) {
            //     $dialplan["dialplan_xml"] .= "      <action application=\"export\" data=\"accountcode=".xml::sanitize($destination_accountcode)."\" inline=\"true\"/>\n";
            // }
            // if (!empty($destination_carrier)) {
            //     $dialplan["dialplan_xml"] .= "      <action application=\"set\" data=\"carrier=".xml::sanitize($destination_carrier)."\" inline=\"true\"/>\n";
            // }
            // if (!empty($fax_uuid)) {
            //     $dialplan["dialplan_xml"] .= "      <action application=\"set\" data=\"presence_id=\$1@".$_SESSION['domain_name']."\" inline=\"true\"/>\n";
            //     $dialplan["dialplan_xml"] .= "      <action application=\"set\" data=\"tone_detect_hits=1\" inline=\"true\"/>\n";
            //     $dialplan["dialplan_xml"] .= "      <action application=\"set\" data=\"execute_on_tone_detect=transfer ".xml::sanitize($fax_extension)." XML \${domain_name}\" inline=\"true\"/>\n";
            //     $dialplan["dialplan_xml"] .= "      <action application=\"tone_detect\" data=\"fax 1100 r +3000\"/>\n";
            // }

            $dialplan["dialplan_xml"] .= "  </condition>\n";
            $dialplan["dialplan_xml"] .= "</extension>\n";


            $dialplan_xml = $dialplan["dialplan_xml"];

            //old code : 15/08/2024
            // $dialplan_xml = '
            //                     <extension name="'.$destination_number.'" continue="false" uuid="'.$dialplan_id.'">
            //                         <condition field="destination_number" expression="^('.$destination_number.')$">
            //                             <action application="export" data="call_direction=inbound" inline="true"/>
            //                             <action application="set" data="domain_uuid='.$domain_id.'" inline="true"/>
            //                             <action application="set" data="domain_name='.$domain_name.'" inline="true"/>
            //                             <action application="transfer" data="'.$destination_data.'"/>
            //                         </condition>
            //                     </extension>
            //               ';

            $insertQuery = "INSERT INTO public.v_dialplans (dialplan_uuid, app_uuid, domain_uuid, dialplan_context, dialplan_name, dialplan_number, dialplan_continue, dialplan_order, dialplan_xml, dialplan_enabled, dialplan_description, insert_user) VALUES ('$dialplan_id', '$app_uuid', '$domain_id', 'public', '$destination_number', '$destination_number', 'false', '100', '$dialplan_xml', 'true', '$domain_name', '$userID')";
            $resultQuery = pg_query($con, $insertQuery);

            if ($resultQuery) {

                $dialplan_regex = "^(".$destination_number.")$";
                $dialplan_detail_tags = ['condition', 'action'];
                $dialplan_detail_types = ['destination_number', 'transfer'];
                $dialplan_detail_datas = [$dialplan_regex, $destination_data];

                // Loop through the arrays and call the API
                $dialplan_detail_order = 20;
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
                    $dialplan_detail_order += 20;
                }
            }
            return $dialplan_id;
        }
    }
?>
