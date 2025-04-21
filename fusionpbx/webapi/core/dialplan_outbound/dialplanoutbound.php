<?php
    require("../../config/config.php");
    require("../../vendor/autoload.php");
    
    use Ramsey\Uuid\Uuid;

    class DialplanOutbound {

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

            $app_uuid = '8c914ec3-9fc0-8ab5-4cda-6c9288bdc9a3';

            $query = "SELECT * FROM public.v_dialplans
            JOIN public.v_domains
            ON v_domains.domain_uuid = v_dialplans.domain_uuid where v_dialplans.app_uuid = '$app_uuid'";
            $result = pg_query($con, $query);
            return $result;
        }

        public function fetch_by_id($con, $id) {

            $app_uuid = '8c914ec3-9fc0-8ab5-4cda-6c9288bdc9a3';

            $query = "SELECT * FROM public.v_dialplans
            JOIN public.v_domains
            ON v_domains.domain_uuid = v_dialplans.domain_uuid
            WHERE v_dialplans.dialplan_uuid = '$id' and v_dialplans.app_uuid = '$app_uuid'";
            $result = pg_query($con, $query);
            return $result;
        }

        public function fetch_dialplanoutbound_settings($con, $id) {
            $query = "SELECT * FROM public.v_dialplan_details
            JOIN public.v_dialplans
            ON v_dialplans.dialplan_uuid = v_dialplan_details.dialplan_uuid
            WHERE v_dialplan_details.dialplan_uuid = '$id'";
            $result = pg_query($con, $query);
            return $result;
        }

        public function fetch_by_domain($con, $id) {

            $app_uuid = '8c914ec3-9fc0-8ab5-4cda-6c9288bdc9a3';
            
            $query = "SELECT * FROM public.v_dialplans
            JOIN public.v_domains
            ON v_domains.domain_uuid = v_dialplans.domain_uuid
            WHERE v_dialplans.domain_uuid = '$id' and v_dialplans.app_uuid = '$app_uuid'";
            $result = pg_query($con, $query);
            return $result;
        }

        public function post($con, $uuidDialPlan, $gateway_id,$gateway_2, $gateway_3, $expression_detail, $dialplanoutbound_prefix, $order, $domain, $context, $description, $dialplanoutbound_enabled, $userID,$name, $type = 'add') {
            if (empty(trim($gateway_id))) {
                echo json_encode([
                    "msg"     => 'Gateway Cannot be EMPTY !'
                ]);
                return;
            } elseif (empty(trim($order))) {
                echo json_encode([
                    "msg"     => 'Please Select Order !'
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
            } elseif (empty(($expression_detail))) {
                echo json_encode([
                    "msg"     => 'Expression cannot be EMPTY !'
                ]);
                return;
            }
            //elseif ($dialplanoutbound_prefix < 0) {
            //    echo json_encode([
             //       "msg"     => 'Prefix is Required !'
             //   ]);
              //  return;
           // }

            $gateway_array = explode(":",$gateway_2);

  /*          if(!empty($gateway_array)){
                $name = $gateway_array[1];
            }else{
                $name = 'netsip.0d';
            } */
            
            $dialplan_number = '';
            // $new_expression = "^".$expression_detail."(\d*)$";
            $new_expression = $expression_detail;

            $dialplan_xml = '<extension name="$name" continue="false" uuid="'.$uuidDialPlan.'">
                                <condition field="${user_exists}" expression="false"/>
                                <condition field="destination_number" expression="'.$new_expression.'">
                                    <action application="set" data="sip_h_accountcode=${accountcode}"/>
                                    <action application="export" data="call_direction=outbound" inline="true"/>
                                    <action application="unset" data="call_timeout"/>
                                    <action application="set" data="hangup_after_bridge=true"/>
                                    <action application="set" data="effective_caller_id_name=${outbound_caller_id_name}"/>
                                    <action application="set" data="effective_caller_id_number=${outbound_caller_id_number}"/>
                                    <action application="set" data="inherit_codec=true"/>
                                    <action application="set" data="ignore_display_updates=true"/>
                                    <action application="set" data="callee_id_number=$1"/>
                                    <action application="set" data="continue_on_fail=1,2,3,6,18,21,27,28,31,34,38,41,42,44,58,88,111,403,501,602,607,809"/>
                                    <action application="bridge" data="sofia/gateway/'.$gateway_id.'/'.$dialplanoutbound_prefix.'$1"/>
                                </condition>
                            </extension>';
            
            $dialplan_second_uuid = Uuid::uuid4()->toString();
            $dialplan_second_xml = '<extension name="call_direction-outbound" continue="true" uuid="'.$dialplan_second_uuid.'">
                                        <condition field="${user_exists}" expression="false"/>
                                        <condition field="${call_direction}" expression="^$"/>
                                        <condition field="destination_number" expression="'.$new_expression.'">
                                            <action application="export" data="call_direction=outbound" inline="true"/>
                                        </condition>
                                    </extension>';
            

            $app_uuid = '8c914ec3-9fc0-8ab5-4cda-6c9288bdc9a3';
            $insertQuery = "INSERT INTO public.v_dialplans (app_uuid, dialplan_uuid, domain_uuid, dialplan_context, dialplan_name, dialplan_number, dialplan_continue, dialplan_order, dialplan_xml, dialplan_enabled, dialplan_description, insert_user) VALUES ('$app_uuid', '$uuidDialPlan', '$domain', '$context', '$name', '$dialplan_number', 'false', '$order', '$dialplan_xml', '$dialplanoutbound_enabled', '$description', '$userID')";
            $resultQuery = pg_query($con, $insertQuery);
            if ($resultQuery) {
                 
                $dialplan_detail_tags = ['condition', 'condition', 'action', 'action', 'action', 'action', 'action', 'action', 'action', 'action', 'action', 'action', 'action'];
                $dialplan_detail_types = ['${user_exists}', 'destination_number', 'set', 'export', 'unset', 'set', 'set', 'set', 'set', 'set', 'set', 'set', 'bridge'];
                $dialplan_detail_datas = ['false', "$new_expression", 'sip_h_accountcode=${accountcode}', 'call_direction=outbound', 'call_timeout', 'hangup_after_bridge=true', 'effective_caller_id_name=${outbound_caller_id_name}', 'effective_caller_id_number=${outbound_caller_id_number}', 'inherit_codec=true', 'ignore_display_updates=true', 'callee_id_number=$1', 'continue_on_fail=1,2,3,6,18,21,27,28,31,34,38,41,42,44,58,88,111,403,501,602,607,809', 'sofia/gateway/'.$gateway_id.'/'.$dialplanoutbound_prefix.'$1'];

                // Loop through the arrays and call the API
                $dialplan_detail_order = 10;
                for ($i = 0; $i < 13; $i++) {
                    $uuidSetting = Uuid::uuid4()->toString(); // Generate new UUID for each iteration

                    // Get values from arrays
                    $dialplan_detail_tag = $dialplan_detail_tags[$i % count($dialplan_detail_tags)];
                    $dialplan_detail_type = $dialplan_detail_types[$i % count($dialplan_detail_types)];
                    $dialplan_detail_data = $dialplan_detail_datas[$i % count($dialplan_detail_datas)];
                    $dialplan_detail_group = 0;

                    $dialplan_id = $uuidDialPlan; 
                    // Construct and execute the SQL query
                    $insertQueueSettings = "INSERT INTO public.v_dialplan_details (dialplan_detail_uuid, dialplan_uuid, domain_uuid, dialplan_detail_tag, dialplan_detail_type, dialplan_detail_data, dialplan_detail_group, dialplan_detail_order, dialplan_detail_enabled, insert_user) VALUES ('$uuidSetting', '$dialplan_id', '$domain', '$dialplan_detail_tag', '$dialplan_detail_type', '$dialplan_detail_data', '$dialplan_detail_group', '$dialplan_detail_order', 'true', '$userID')";
                    $resultQueueSettings = pg_query($con, $insertQueueSettings);
                    $dialplan_detail_order += 10;

                    // Check for errors or handle results as needed
                }


                if(!empty($gateway_2)){

                    $gateway_array = explode(":",$gateway_2);

                    $uuidSetting = Uuid::uuid4()->toString();
                    $dialplan_detail_tag = 'action';
                    $dialplan_detail_type = 'bridge';
                    $dialplan_detail_data = $gateway_array[1];
                    $dialplan_detail_group = '0';

                    $insertQueueSettings = "INSERT INTO public.v_dialplan_details (dialplan_detail_uuid, dialplan_uuid, domain_uuid, dialplan_detail_tag, dialplan_detail_type, dialplan_detail_data, dialplan_detail_group, dialplan_detail_order, dialplan_detail_enabled, insert_user) VALUES ('$uuidSetting', '$dialplan_id', '$domain', '$dialplan_detail_tag', '$dialplan_detail_type', '$dialplan_detail_data', '$dialplan_detail_group', '$dialplan_detail_order', 'true', '$userID')";
                    $resultQueueSettings = pg_query($con, $insertQueueSettings);
                    $dialplan_detail_order += 10;
                
                }

                if(!empty($gateway_3)){

                    $gateway_array = explode(":",$gateway_3);

                    $uuidSetting = Uuid::uuid4()->toString();
                    $dialplan_detail_tag = 'action';
                    $dialplan_detail_type = 'bridge';
                    $dialplan_detail_data = $gateway_array[1];
                    $dialplan_detail_group = '0';

                    $insertQueueSettings = "INSERT INTO public.v_dialplan_details (dialplan_detail_uuid, dialplan_uuid, domain_uuid, dialplan_detail_tag, dialplan_detail_type, dialplan_detail_data, dialplan_detail_group, dialplan_detail_order, dialplan_detail_enabled, insert_user) VALUES ('$uuidSetting', '$dialplan_id', '$domain', '$dialplan_detail_tag', '$dialplan_detail_type', '$dialplan_detail_data', '$dialplan_detail_group', '$dialplan_detail_order', 'true', '$userID')";
                    $resultQueueSettings = pg_query($con, $insertQueueSettings);
                    $dialplan_detail_order += 10;

                }

                if($type == 'add'){
                    $second_name = "call_direction-outbound";
                    $second_order = '022';
                    $insertSecondQuery = "INSERT INTO public.v_dialplans (app_uuid, dialplan_uuid, domain_uuid, dialplan_context, dialplan_name, dialplan_number, dialplan_continue, dialplan_order, dialplan_xml, dialplan_enabled, dialplan_description, insert_user) VALUES ('$app_uuid', '$dialplan_second_uuid', '$domain', '$second_name', '$second_name', '$dialplan_number', 'true', '$second_order', '$dialplan_second_xml', 'true', '$description', '$userID')";
                    $resultSecondQuery = pg_query($con, $insertSecondQuery);
                
                 if ($resultSecondQuery) {

                $dialplan_detail_tags = ['condition', 'condition', 'condition', 'action'];
                $dialplan_detail_types = ['${user_exists}', '${call_direction}', 'destination_number', 'export'];
                $dialplan_detail_datas = ['false', "^$", "^(.*)$", 'call_direction=outbound'];

                // Loop through the arrays and call the API
                $dialplan_detail_order = 10;
                for ($i = 0; $i < 4; $i++) {
                    $uuidSetting = Uuid::uuid4()->toString(); // Generate new UUID for each iteration

                    // Get values from arrays
                    $dialplan_detail_tag = $dialplan_detail_tags[$i % count($dialplan_detail_tags)];
                    $dialplan_detail_type = $dialplan_detail_types[$i % count($dialplan_detail_types)];
                    $dialplan_detail_data = $dialplan_detail_datas[$i % count($dialplan_detail_datas)];
                    $dialplan_detail_group = 0;

                    $dialplan_id = $dialplan_second_uuid; 
                    $insertQueueSecondSettings = "INSERT INTO public.v_dialplan_details (dialplan_detail_uuid, dialplan_uuid, domain_uuid, dialplan_detail_tag, dialplan_detail_type, dialplan_detail_data, dialplan_detail_group, dialplan_detail_order, dialplan_detail_enabled, insert_user) VALUES ('$uuidSetting', '$dialplan_id', '$domain', '$dialplan_detail_tag', '$dialplan_detail_type', '$dialplan_detail_data', '$dialplan_detail_group', '$dialplan_detail_order', 'true', '$userID')";
                    $resultQueueSecondSettings = pg_query($con, $insertQueueSecondSettings);
                    $dialplan_detail_order += 10;
                }
				 }
				}
                echo json_encode([
                    "msg"     => 'Dialplan Outbound Created Successfully !!',
                    "id"      => $uuidDialPlan
                ]);
                return;

                
            } else {
                echo json_encode([

                    "msg"     => 'Failed to Create Dialplan Outbound, Try Again !!'
                ]);
                return;
            }       
        }

        public function postQueueSettings($con, $uuidSetting, $dialplan_id, $domain, $dialplan_detail_tag, $dialplan_detail_type, $dialplan_detail_data, $dialplan_detail_break, $dialplan_detail_group, $dialplan_detail_order, $userID, $type = 'add') {
            if (empty(trim($dialplan_id))) {
                echo json_encode([
                    "msg"     => 'Please Select Dial Plan !'
                ]);
                return;
            } elseif (empty(trim($domain))) {
                echo json_encode([
                    "msg"     => 'Please Select Domain !'
                ]);
                return;
            } elseif (empty(trim($dialplan_detail_tag))) {
                echo json_encode([
                    "msg"     => 'Please Select Condition !'
                ]);
                return;
            } elseif (empty(trim($dialplan_detail_type))) {
                echo json_encode([
                    "msg"     => 'Please Select Type !'
                ]);
                return;
            } elseif (empty(trim($dialplan_detail_group))) {
                echo json_encode([
                    "msg"     => 'Please Select Group !'
                ]);
                return;
            }

            if ($dialplan_detail_type == "destination_number") {
                $query = "SELECT * FROM public.v_dialplans WHERE v_dialplans.dialplan_uuid = '$dialplan_id'";
                $result = pg_query($con, $query);
                $row = pg_fetch_assoc($result);

                $dialplan_detail_data = "^".$row['dialplan_number']."$";
            }

            if (empty(trim($dialplan_detail_data))) {
                echo json_encode([
                    "msg"     => 'Please Select Action !'
                ]);
                return;
            } 

            $insertQueueSettings = "INSERT INTO public.v_dialplan_details (dialplan_detail_uuid, dialplan_uuid, domain_uuid, dialplan_detail_tag, dialplan_detail_type, dialplan_detail_data, dialplan_detail_break, dialplan_detail_group, dialplan_detail_order, dialplan_detail_enabled, insert_user) VALUES ('$uuidSetting', '$dialplan_id', '$domain', '$dialplan_detail_tag', '$dialplan_detail_type', '$dialplan_detail_data', '$dialplan_detail_break', '$dialplan_detail_group', '$dialplan_detail_order', 'true', '$userID')";
            $resultQueueSettings = pg_query($con, $insertQueueSettings);
            if ($resultQueueSettings) {

                if($type == 'add'){
                    echo json_encode([
                        "msg"     => 'Dialplan Outbound Settings Created Successfully !!',
                        "id"      => $uuidSetting
                    ]);
                }else{
                    echo json_encode([
                        "msg"     => 'Dialplan Outbound Settings Updated Successfully !!',
                        "id"      => $uuidSetting
                    ]);
                }

                
                return;
            } else {

                if($type == 'add'){
                    echo json_encode([
                        "msg"     => 'Failed to Create Dialplan Outbound Settings, Try Again !!'
                    ]);
                }else{
                    echo json_encode([
                        "msg"     => 'Failed to update Dialplan Outbound Settings, Try Again !!'
                    ]);
                }

                
                return;
            }       
        }

        public function update($con, $dialplan_outbound_id, $dialplanoutbound_prefix, $name, $order, $domain, $context, $description, $dialplanoutbound_enabled, $expression_detail, $gateway_id) {
            if (empty(trim($name))) {
                echo json_encode([
                    "msg"     => 'Name Cannot be EMPTY !'
                ]);
                return;
            } elseif (empty(trim($order))) {
                echo json_encode([
                    "msg"     => 'Please Select Order !'
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
            } elseif (empty(($expression_detail))) {
                echo json_encode([
                    "msg"     => 'Expression cannot be EMPTY !'
                ]);
                return;
            } elseif (empty(($gateway_id))) {
                echo json_encode([
                    "msg"     => 'Gateway ID cannot be EMPTY !'
                ]);
                return;
            } 
		//elseif ($dialplanoutbound_prefix < 0) {
               // echo json_encode([
               //     "msg"     => 'Prefix is Required !'
               // ]);
              //  return;
            //}

            $new_expression = $expression_detail;
            $dialplan_xml = '<extension name="netsip.0d" continue="false" uuid="'.$dialplan_outbound_id.'">
                                <condition field="${user_exists}" expression="false"/>
                                <condition field="destination_number" expression="'.$new_expression.'">
                                    <action application="export" data="call_direction=outbound" inline="true"/>
                                    <action application="unset" data="call_timeout"/>
                                    <action application="set" data="hangup_after_bridge=true"/>
                                    <action application="set" data="effective_caller_id_name=${outbound_caller_id_name}"/>
                                    <action application="set" data="effective_caller_id_number=${outbound_caller_id_number}"/>
                                    <action application="set" data="inherit_codec=true"/>
                                    <action application="set" data="ignore_display_updates=true"/>
                                    <action application="set" data="callee_id_number=$1"/>
                                    <action application="set" data="continue_on_fail=1,2,3,6,18,21,27,28,31,34,38,41,42,44,58,88,111,403,501,602,607,809"/>
                                    <action application="bridge" data="sofia/gateway/'.$gateway_id.'/'.$dialplanoutbound_prefix.'$1"/>
                                </condition>
                            </extension>';
            
            $updateQuery = "UPDATE public.v_dialplans SET
                domain_uuid = '$domain',
                dialplan_context = '$context',
                dialplan_name = '$name',
                dialplan_continue = 'false',
                dialplan_order = '$order',
                dialplan_enabled = '$dialplanoutbound_enabled',
                dialplan_xml = '$dialplan_xml',
                dialplan_description = '$description'
                WHERE dialplan_uuid = '$dialplan_outbound_id'";
            $resultQuery = pg_query($con, $updateQuery);
            if ($resultQuery) {

                $updateQuerySecond = "UPDATE public.v_dialplan_details SET
                dialplan_detail_data = '$new_expression'
                WHERE dialplan_uuid = '$dialplan_outbound_id' AND dialplan_detail_type = 'destination_number'";
                pg_query($con, $updateQuerySecond);

                echo json_encode([
                    "msg"     => 'Dialplan Outbound Updated Successfully !!',
                ]);
                return;
            } else {
                echo json_encode([

                    "msg"     => 'Failed to Update Dialplan Outbound, Try Again !!'
                ]);
                return;
            }       
        }

        public function delete($con, $id, $type = 'delete') {
            $query = "DELETE FROM public.v_dialplans WHERE dialplan_uuid = '$id'";
            $result = pg_query($con, $query);
            if ($result) {
                $queryDialplanSettings = "DELETE FROM public.v_dialplan_details WHERE dialplan_uuid = '$id'";
                $resultDialplanSettings = pg_query($con, $queryDialplanSettings);

                if($type == 'delete'){

                    if ($resultDialplanSettings) {
                        echo json_encode([
                            "message" => "Deleted Successfully !!"
                        ]);            
                        return;
                    } else {
                        echo json_encode([
                            "message" => "Failed to Delete, Try Again !!"
                        ]);            
                        return;
                    }

                }
                
            } else {

                if($type == 'delete'){

                    echo json_encode([
                        "message" => "Failed to Delete, Try Again !!"
                    ]);            
                    return;
                }
            }
        }
    }
?>
