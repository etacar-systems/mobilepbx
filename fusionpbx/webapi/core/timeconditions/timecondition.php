<?php
    require("../../config/config.php");
    require("../classes/SocketConnection.php");

    //require("../../../resources/classes/event_socket.php");
    use Ramsey\Uuid\Uuid;

    class TimeCondition {

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
            $app_uuid = '4b821450-926b-175a-af93-a03c441818b1';
            $query = "SELECT * FROM public.v_dialplans
            JOIN public.v_domains
            ON v_domains.domain_uuid = v_dialplans.domain_uuid AND app_uuid = '$app_uuid' ";
            $result = pg_query($con, $query);
            return $result;
        }

        public function fetch_by_id($con, $id) {
            $app_uuid = '4b821450-926b-175a-af93-a03c441818b1';
            $query = "SELECT * FROM public.v_dialplans
            JOIN public.v_domains
            ON v_domains.domain_uuid = v_dialplans.domain_uuid
            WHERE v_dialplans.dialplan_uuid = '$id' AND app_uuid = '$app_uuid' ";
            $result = pg_query($con, $query);
            return $result;
        }

        public function fetch_timecondition_settings($con, $id) {
            $app_uuid = '4b821450-926b-175a-af93-a03c441818b1';
            $query = "SELECT * FROM public.v_dialplan_details
            JOIN public.v_dialplans
            ON v_dialplans.dialplan_uuid = v_dialplan_details.dialplan_uuid
            WHERE v_dialplan_details.dialplan_uuid = '$id' AND app_uuid = '$app_uuid' ";
            $result = pg_query($con, $query);
            return $result;
        }

        public function fetch_by_domain($con, $id) {
            $app_uuid = '4b821450-926b-175a-af93-a03c441818b1';
            $query = "SELECT * FROM public.v_dialplans
            JOIN public.v_domains
            ON v_domains.domain_uuid = v_dialplans.domain_uuid
            WHERE v_dialplans.domain_uuid = '$id' AND app_uuid = '$app_uuid' ";
            $result = pg_query($con, $query);
            return $result;
        }

        public function post($con, $uuidDialPlan, $name, $extension, $order, $domain, $context, $description, $timecondition_enabled, $userID,$timecondition_data, $dialplan_action, $dialplan_anti_action) {
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
            }

            if (empty($ring_group_strategy)){
                $ring_group_strategy = 'simultaneous';
            }

            $timecondition_xml = '<extension name="'.$name.'" continue="false" uuid="'.$uuidDialPlan.'">'. "\n";
            $timecondition_xml .= '<condition field="destination_number" expression="^'.$extension.'$"/>'. "\n";

            if(!empty($timecondition_data)){
                $str = '';
                foreach ($timecondition_data as $k) {                    

                    $str .= $k->dialplan_detail_type.'="'.$k->dialplan_detail_data.'" ';
                }

                if(strlen($str) > 0){
                    $timecondition_xml .= '<condition '.$str.' break="never">'. "\n";                    

                    if(!empty($dialplan_action)){

                        $dialplan_action_array = explode(":", $dialplan_action);
                        $dialplan_action_data = join(':', $dialplan_action_array);

                        $timecondition_xml .= ' <action application="transfer" data="'.$dialplan_action_array[1].'"/>'. "\n";
                    }
                    $timecondition_xml .= '</condition>'. "\n";
                }                
            }

            if(!empty($dialplan_anti_action)){

                $dialplan_action_array = explode(":", $dialplan_anti_action);
                $dialplan_action_data = join(':', $dialplan_action_array);

                $timecondition_xml .= '<condition field="destination_number" expression="^'.$extension.'$" >'. "\n";
                $timecondition_xml .= ' <action application="transfer" data="'.$dialplan_action_array[1].'"/>'. "\n";
                $timecondition_xml .= '</condition>';
            }


            $timecondition_xml .= '</extension>'. "\n";


            $app_uuid = '4b821450-926b-175a-af93-a03c441818b1';
            $insertTimeCondition = "INSERT INTO public.v_dialplans (app_uuid, dialplan_uuid, domain_uuid, dialplan_context, dialplan_name, dialplan_number, dialplan_continue, dialplan_xml, dialplan_order, dialplan_enabled, dialplan_description, insert_user) VALUES ('$app_uuid', '$uuidDialPlan', '$domain', '$context', '$name', '$extension', 'false', '$timecondition_xml', '$order', '$timecondition_enabled', '$description', '$userID')";
            $resultTimeCondition = pg_query($con, $insertTimeCondition);
            if ($resultTimeCondition) {

                // start : 10/08/2024 : atul
                $settings_array = array();
                $dialplan_detail_order = 0;
                

                    if(!empty($dialplan_action)){

                        $dialplan_detail_order += 10;
                        $dialplan_detail_tag = 'condition';
                        $dialplan_detail_type = 'destination_number';
                        $dialplan_detail_data = '^'.$extension.'$';
                        $dialplan_detail_break = null;
                        $dialplan_detail_group = 500;
                        $dialplan_detail_order = $dialplan_detail_order;

                        $uuid = Uuid::uuid4();
                        $dialplan_detail_uuid = $uuid->toString();

                        $this->postTimeConditionSettings($con, $dialplan_detail_uuid, $uuidDialPlan, $domain, $dialplan_detail_tag, $dialplan_detail_type, $dialplan_detail_data, $dialplan_detail_break, $dialplan_detail_group, $dialplan_detail_order, $userID);


                        $dialplan_action_array = explode(":", $dialplan_action);
                        $dialplan_action_app = array_shift($dialplan_action_array);
                        $dialplan_action_data = join(':', $dialplan_action_array);

                        $dialplan_detail_order += 10;

                        $dialplan_detail_tag = 'action';
                        $dialplan_detail_type = $dialplan_action_app;
                        $dialplan_detail_data = $dialplan_action_data;
                        $dialplan_detail_break = null;
                        $dialplan_detail_group = 500;
                        $dialplan_detail_order = $dialplan_detail_order;

                        $uuid = Uuid::uuid4();
                        $dialplan_detail_uuid = $uuid->toString();

                        $this->postTimeConditionSettings($con, $dialplan_detail_uuid, $uuidDialPlan, $domain, $dialplan_detail_tag, $dialplan_detail_type, $dialplan_detail_data, $dialplan_detail_break, $dialplan_detail_group, $dialplan_detail_order, $userID);

                    }

                    if(!empty($timecondition_data)){

                        foreach ($timecondition_data as $k) {

                            $uuid = Uuid::uuid4();                        
                            // Get the UUID as a string
                            $uuidTimeConditionSetting = $uuid->toString();
                            
                            $dialplan_detail_tag = $k->dialplan_detail_tag;
                            $dialplan_detail_type = $k->dialplan_detail_type;
                            $dialplan_detail_data = $k->dialplan_detail_data;                        

                            $dialplan_detail_order += 10;
                            $dialplan_detail_group = 500;
                            $dialplan_detail_break = 'never';

                            array_push($settings_array, array('dialplan_detail_type'=>$dialplan_detail_type,'dialplan_detail_uuid'=>$uuidTimeConditionSetting));

                            $this->postTimeConditionSettings($con, $uuidTimeConditionSetting, $uuidDialPlan, $domain, $dialplan_detail_tag, $dialplan_detail_type, $dialplan_detail_data, $dialplan_detail_break, $dialplan_detail_group, $dialplan_detail_order, $userID);
                        }

                    }

                    if(!empty($dialplan_anti_action)){

                        $dialplan_detail_order_anti_action = 10;
                        $dialplan_detail_tag = 'condition';
                        $dialplan_detail_type = 'destination_number';
                        $dialplan_detail_data = '^'.$extension.'$';
                        $dialplan_detail_break = null;
                        $dialplan_detail_group = 999;

                        $uuid = Uuid::uuid4();
                        $dialplan_detail_uuid = $uuid->toString();

                        $this->postTimeConditionSettings($con, $dialplan_detail_uuid, $uuidDialPlan, $domain, $dialplan_detail_tag, $dialplan_detail_type, $dialplan_detail_data, $dialplan_detail_break, $dialplan_detail_group, $dialplan_detail_order_anti_action, $userID);


                        $dialplan_anti_action_array = explode(":", $dialplan_anti_action);
                        $dialplan_anti_action_app = array_shift($dialplan_anti_action_array);
                        $dialplan_anti_action_data = join(':', $dialplan_anti_action_array);

                        $dialplan_detail_order_anti_action += 10;

                        $dialplan_detail_tag = 'action';
                        $dialplan_detail_type = $dialplan_anti_action_app;
                        $dialplan_detail_data = $dialplan_anti_action_data;
                        $dialplan_detail_break = null;
                        $dialplan_detail_group = 999;

                        $uuid = Uuid::uuid4();
                        $dialplan_detail_uuid = $uuid->toString();

                        $this->postTimeConditionSettings($con, $dialplan_detail_uuid, $uuidDialPlan, $domain, $dialplan_detail_tag, $dialplan_detail_type, $dialplan_detail_data, $dialplan_detail_break, $dialplan_detail_group, $dialplan_detail_order_anti_action, $userID);
                    }  

                // end : 10/08/2024 : atul


                    SocketConnection::cache_delete("dialplan:".$context);

                echo json_encode([
                    "msg"     => 'Time Condition Created Successfully !!',
                    "id"      => $uuidDialPlan,
                    "settings"      => $settings_array
                ]);
                return;
            } else {
                echo json_encode([

                    "msg"     => 'Failed to Create Time Condition, Try Again !!'
                ]);
                return;
            }       
        }

        public function postTimeConditionSettings($con, $uuidTimeConditionSetting, $dialplan_id, $domain, $dialplan_detail_tag, $dialplan_detail_type, $dialplan_detail_data, $dialplan_detail_break, $dialplan_detail_group, $dialplan_detail_order, $userID) {
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
            } elseif (empty(trim($dialplan_detail_data))) {
                echo json_encode([
                    "msg"     => 'Please Select Action !'
                ]);
                return;
            } 

            if ($dialplan_detail_type == "destination_number") {
                $query = "SELECT * FROM public.v_dialplans WHERE v_dialplans.dialplan_uuid = '$dialplan_id'";
                $result = pg_query($con, $query);
                $row = pg_fetch_assoc($result);

                $dialplan_detail_data = "^".$row['dialplan_number']."$";
            }

            

            $insertTimeConditionSettings = "INSERT INTO public.v_dialplan_details (dialplan_detail_uuid, dialplan_uuid, domain_uuid, dialplan_detail_tag, dialplan_detail_type, dialplan_detail_data, dialplan_detail_break, dialplan_detail_group, dialplan_detail_order, dialplan_detail_enabled, insert_user) VALUES ('$uuidTimeConditionSetting', '$dialplan_id', '$domain', '$dialplan_detail_tag', '$dialplan_detail_type', '$dialplan_detail_data', '$dialplan_detail_break', '$dialplan_detail_group', '$dialplan_detail_order', 'true', '$userID')";
            $resultTimeConditionSettings = pg_query($con, $insertTimeConditionSettings);
            if ($resultTimeConditionSettings) {
                // echo json_encode([
                //     "msg"     => 'Time Condition Settings Created Successfully !!',
                //     "id"      => $uuidTimeConditionSetting
                // ]);
                return;
            } else {
                echo json_encode([

                    "msg"     => 'Failed to Create Time Condition Settings, Try Again !!'
                ]);
                return;
            }       
        }

        public function update($con, $timecondition_id, $name, $extension, $order, $domain, $context, $description, $timecondition_enabled,$timecondition_data, $dialplan_action, $dialplan_anti_action, $userID) {
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
            }

            if (empty($ring_group_strategy)){
                $ring_group_strategy = 'simultaneous';
            }

            $timecondition_xml = '<extension name="'.$name.'" continue="false" uuid="'.$timecondition_id.'">'. "\n";
            $timecondition_xml .= '<condition field="destination_number" expression="^'.$extension.'$"/>'. "\n";

            if(!empty($timecondition_data)){
                $str = '';
                foreach ($timecondition_data as $k) {                    

                    $str .= $k->dialplan_detail_type.'="'.$k->dialplan_detail_data.'" ';
                }

                if(strlen($str) > 0){
                    $timecondition_xml .= '<condition '.$str.' break="never">'. "\n";                    

                    if(!empty($dialplan_action)){

                        $dialplan_action_array = explode(":", $dialplan_action);
                        $dialplan_action_data = join(':', $dialplan_action_array);

                        $timecondition_xml .= ' <action application="transfer" data="'.$dialplan_action_array[1].'"/>'. "\n";
                    }
                    $timecondition_xml .= '</condition>'. "\n";
                }                
            }

            if(!empty($dialplan_anti_action)){

                $dialplan_action_array = explode(":", $dialplan_anti_action);
                $dialplan_action_data = join(':', $dialplan_action_array);

                $timecondition_xml .= '<condition field="destination_number" expression="^'.$extension.'$" >'. "\n";
                $timecondition_xml .= ' <action application="transfer" data="'.$dialplan_action_array[1].'"/>'. "\n";
                $timecondition_xml .= '</condition>';
            }


            $timecondition_xml .= '</extension>'. "\n";


            $updateTimeCondition = "UPDATE public.v_dialplans SET
                domain_uuid = '$domain',
                dialplan_context = '$context',
                dialplan_name = '$name',
                dialplan_number = '$extension',
                dialplan_continue = 'false',
                dialplan_xml = '$timecondition_xml',
                dialplan_order = '$order',
                dialplan_enabled = '$timecondition_enabled',
                dialplan_description = '$description'
                WHERE dialplan_uuid = '$timecondition_id'";
            $resultTimeCondition = pg_query($con, $updateTimeCondition);
            if ($resultTimeCondition) {

                $queryTimeConditionSettings = "DELETE FROM public.v_dialplan_details WHERE dialplan_uuid = '$timecondition_id'";
                $resultTimeConditionSettings = pg_query($con, $queryTimeConditionSettings);


                // start : 11/08/2024 : atul
                $settings_array = array();                

                    $dialplan_detail_order = 0;

                    if(!empty($dialplan_action)){

                        $dialplan_detail_order += 10;
                        $dialplan_detail_tag = 'condition';
                        $dialplan_detail_type = 'destination_number';
                        $dialplan_detail_data = '^'.$extension.'$';
                        $dialplan_detail_break = null;
                        $dialplan_detail_group = 500;
                        $dialplan_detail_order = $dialplan_detail_order;

                        $uuid = Uuid::uuid4();
                        $dialplan_detail_uuid = $uuid->toString();

                        $this->postTimeConditionSettings($con, $dialplan_detail_uuid, $timecondition_id, $domain, $dialplan_detail_tag, $dialplan_detail_type, $dialplan_detail_data, $dialplan_detail_break, $dialplan_detail_group, $dialplan_detail_order, $userID);


                        $dialplan_action_array = explode(":", $dialplan_action);
                        $dialplan_action_app = array_shift($dialplan_action_array);
                        $dialplan_action_data = join(':', $dialplan_action_array);

                        $dialplan_detail_order += 10;

                        $dialplan_detail_tag = 'action';
                        $dialplan_detail_type = $dialplan_action_app;
                        $dialplan_detail_data = $dialplan_action_data;
                        $dialplan_detail_break = null;
                        $dialplan_detail_group = 500;
                        $dialplan_detail_order = $dialplan_detail_order;

                        $uuid = Uuid::uuid4();
                        $dialplan_detail_uuid = $uuid->toString();

                        $this->postTimeConditionSettings($con, $dialplan_detail_uuid, $timecondition_id, $domain, $dialplan_detail_tag, $dialplan_detail_type, $dialplan_detail_data, $dialplan_detail_break, $dialplan_detail_group, $dialplan_detail_order, $userID);
                    }

                    if(!empty($timecondition_data)){
                        foreach ($timecondition_data as $k) {

                            $uuid = Uuid::uuid4();                        
                            // Get the UUID as a string
                            $uuidTimeConditionSetting = $uuid->toString();
                            
                            $dialplan_detail_tag = $k->dialplan_detail_tag;
                            $dialplan_detail_type = $k->dialplan_detail_type;
                            $dialplan_detail_data = $k->dialplan_detail_data;                        

                            $dialplan_detail_order += 10;
                            $dialplan_detail_group = 500;
                            $dialplan_detail_break = 'never';

                            array_push($settings_array, array('dialplan_detail_type'=>$dialplan_detail_type,'dialplan_detail_uuid'=>$uuidTimeConditionSetting));

                            $this->postTimeConditionSettings($con, $uuidTimeConditionSetting, $timecondition_id, $domain, $dialplan_detail_tag, $dialplan_detail_type, $dialplan_detail_data, $dialplan_detail_break, $dialplan_detail_group, $dialplan_detail_order, $userID);
                        }
                    }

                    if(!empty($dialplan_anti_action)){

                        $dialplan_detail_order_anti_action = 10;
                        $dialplan_detail_tag = 'condition';
                        $dialplan_detail_type = 'destination_number';
                        $dialplan_detail_data = '^'.$extension.'$';
                        $dialplan_detail_break = null;
                        $dialplan_detail_group = 999;

                        $uuid = Uuid::uuid4();
                        $dialplan_detail_uuid = $uuid->toString();

                        $this->postTimeConditionSettings($con, $dialplan_detail_uuid, $timecondition_id, $domain, $dialplan_detail_tag, $dialplan_detail_type, $dialplan_detail_data, $dialplan_detail_break, $dialplan_detail_group, $dialplan_detail_order_anti_action, $userID);


                        $dialplan_anti_action_array = explode(":", $dialplan_anti_action);
                        $dialplan_anti_action_app = array_shift($dialplan_anti_action_array);
                        $dialplan_anti_action_data = join(':', $dialplan_anti_action_array);

                        $dialplan_detail_order_anti_action += 10;

                        $dialplan_detail_tag = 'action';
                        $dialplan_detail_type = $dialplan_anti_action_app;
                        $dialplan_detail_data = $dialplan_anti_action_data;
                        $dialplan_detail_break = null;
                        $dialplan_detail_group = 999;

                        $uuid = Uuid::uuid4();
                        $dialplan_detail_uuid = $uuid->toString();

                        $this->postTimeConditionSettings($con, $dialplan_detail_uuid, $timecondition_id, $domain, $dialplan_detail_tag, $dialplan_detail_type, $dialplan_detail_data, $dialplan_detail_break, $dialplan_detail_group, $dialplan_detail_order_anti_action, $userID);

                    }

                // end : 11/08/2024 : atul

                    SocketConnection::cache_delete("dialplan:".$context);

                echo json_encode([
                    "msg"     => 'Time Condition Updated Successfully !!',
                ]);
                return;
            } else {
                echo json_encode([

                    "msg"     => 'Failed to Update Time Condition, Try Again !!'
                ]);
                return;
            }       
        }

        public function updateTimeConditionSettings($con, $timecondition_setting_id, $dialplan_detail_tag, $dialplan_detail_type, $dialplan_detail_data, $dialplan_detail_break, $dialplan_detail_group, $dialplan_detail_order) {
            if (empty(trim($dialplan_detail_tag))) {
                echo json_encode([
                    "msg"     => 'Please Select Condition !'
                ]);
                return;
            } elseif (empty(trim($dialplan_detail_type))) {
                echo json_encode([
                    "msg"     => 'Please Select Type !'
                ]);
                return;
            } elseif (empty(trim($dialplan_detail_data))) {
                echo json_encode([
                    "msg"     => 'Please Select Action !'
                ]);
                return;
            } elseif (empty(trim($dialplan_detail_group))) {
                echo json_encode([
                    "msg"     => 'Please Select Group !'
                ]);
                return;
            }

            $updateTimeConditionSettings = "UPDATE public.v_dialplan_details SET 
                dialplan_detail_tag = '$dialplan_detail_tag',
                dialplan_detail_type = '$dialplan_detail_type',
                dialplan_detail_data = '$dialplan_detail_data',
                dialplan_detail_break = '$dialplan_detail_break',
                dialplan_detail_group = '$dialplan_detail_group',
                dialplan_detail_order = '$dialplan_detail_order'
                WHERE dialplan_detail_uuid = '$timecondition_setting_id'"
            ;
            $resultTimeConditionSettings = pg_query($con, $updateTimeConditionSettings);
            if ($resultTimeConditionSettings) {
                echo json_encode([
                    "msg"     => 'Time Condition Settings Updated Successfully !!',
                ]);
                return;
            } else {
                echo json_encode([

                    "msg"     => 'Failed to Update Time Condition Settings, Try Again !!'
                ]);
                return;
            }       
        }

        public function delete($con, $id) {

            $query = "SELECT v_dialplans.*, v_domains.domain_name  FROM public.v_dialplans
            JOIN public.v_domains
            ON v_domains.domain_uuid = v_dialplans.domain_uuid
            WHERE v_dialplans.dialplan_uuid = '$id'";
            $result = pg_query($con, $query);

            $domain_name = '';
            if (pg_num_rows($result) > 0 ) {                
                while ($row = pg_fetch_assoc($result)) {
                    $domain_name = $row['domain_name'];
                }
            }

            $query = "DELETE FROM public.v_dialplans WHERE dialplan_uuid = '$id'";
            $result = pg_query($con, $query);
            if ($result) {
                $queryTimeConditionSettings = "DELETE FROM public.v_dialplan_details WHERE dialplan_uuid = '$id'";
                $resultTimeConditionSettings = pg_query($con, $queryTimeConditionSettings);
                if ($resultTimeConditionSettings) {

                    SocketConnection::cache_delete("dialplan:".$domain_name);

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
            } else {
                echo json_encode([
                    "message" => "Failed to Delete, Try Again !!"
                ]);            
                return;
            }
        }

        public function delete_timecondition_setting($con, $id) {
            
            $queryTimeConditionSettings = "DELETE FROM public.v_dialplan_details WHERE dialplan_detail_uuid = '$id'";
            $resultTimeConditionSettings = pg_query($con, $queryTimeConditionSettings);
            if ($resultTimeConditionSettings) {
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


        // public function cache_delete($key){

            
        //     $method = 'file';
        
        //     $syslog = 'false';
        
        //     $location = '/var/cache/fusionpbx';
            

        //     //change the delimiter
        //     $key = str_replace(":", ".", $key);

        //     $fp = SocketConnection::_event_socket_create();

        //     $event = "sendevent CUSTOM\n";
        //     $event .= "Event-Name: CUSTOM\n";
        //     $event .= "Event-Subclass: fusion::file\n";
        //     $event .= "API-Command: cache\n";
        //     $event .= "API-Command-Argument: delete ".$key."\n";

        //     $json = SocketConnection::_event_socket_request($fp, $event);

        // //remove the local files
        //     foreach (glob($location . "/" . $key) as $file) {
        //         if (file_exists($file)) {
        //             unlink($file);
        //         }
        //         if (file_exists($file)) {
        //             unlink($file . ".tmp");
        //         }
        //     }
        // }
    }
?>
