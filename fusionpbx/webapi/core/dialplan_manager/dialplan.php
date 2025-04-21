<?php
    require("../../config/config.php");

    class Dialplan {

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
            $query = 'SELECT * FROM public.v_dialplans
            JOIN public.v_domains
            ON v_domains.domain_uuid = v_dialplans.domain_uuid';
            $result = pg_query($con, $query);
            return $result;
        }

        public function fetch_by_id($con, $id) {
            $query = "SELECT * FROM public.v_dialplans
            JOIN public.v_domains
            ON v_domains.domain_uuid = v_dialplans.domain_uuid
            WHERE v_dialplans.dialplan_uuid = '$id'";
            $result = pg_query($con, $query);
            return $result;
        }

        public function fetch_dialplan_settings($con, $id) {
            $query = "SELECT * FROM public.v_dialplan_details
            JOIN public.v_dialplans
            ON v_dialplans.dialplan_uuid = v_dialplan_details.dialplan_uuid
            WHERE v_dialplan_details.dialplan_uuid = '$id'";
            $result = pg_query($con, $query);
            return $result;
        }

        public function fetch_by_domain($con, $id) {
            $query = "SELECT * FROM public.v_dialplans
            JOIN public.v_domains
            ON v_domains.domain_uuid = v_dialplans.domain_uuid
            WHERE v_dialplans.domain_uuid = '$id'";
            $result = pg_query($con, $query);
            return $result;
        }

        public function post($con, $uuidDialPlan, $name, $extension, $order, $domain, $context, $description, $dialplan_enabled, $userID) {
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
            }

            $insertQuery = "INSERT INTO public.v_dialplans (dialplan_uuid, domain_uuid, dialplan_context, dialplan_name, dialplan_number, dialplan_continue, dialplan_order, dialplan_enabled, dialplan_description, insert_user) VALUES ('$uuidDialPlan', '$domain', '$context', '$name', '$extension', 'false', '$order', '$dialplan_enabled', '$description', '$userID')";
            $resultQuery = pg_query($con, $insertQuery);
            if ($resultQuery) {
                echo json_encode([
                    "msg"     => 'Dialplan Inbound Created Successfully !!',
                    "id"      => $uuidDialPlan
                ]);
                return;
            } else {
                echo json_encode([

                    "msg"     => 'Failed to Create Dialplan Inbound, Try Again !!'
                ]);
                return;
            }       
        }

        public function postQueueSettings($con, $uuidSetting, $dialplan_id, $domain, $dialplan_detail_tag, $dialplan_detail_type, $dialplan_detail_data, $dialplan_detail_break, $dialplan_detail_group, $dialplan_detail_order, $userID) {
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
                echo json_encode([
                    "msg"     => 'Dialplan Inbound Settings Created Successfully !!',
                    "id"      => $uuidSetting
                ]);
                return;
            } else {
                echo json_encode([

                    "msg"     => 'Failed to Create Dialplan Inbound Settings, Try Again !!'
                ]);
                return;
            }       
        }

        public function update($con, $dialplan_id, $name, $extension, $order, $domain, $context, $description, $dialplan_enabled) {
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
            }

            
            $updateQuery = "UPDATE public.v_dialplans SET
                domain_uuid = '$domain',
                dialplan_context = '$context',
                dialplan_name = '$name',
                dialplan_number = '$extension',
                dialplan_continue = 'false',
                dialplan_order = '$order',
                dialplan_enabled = '$dialplan_enabled',
                dialplan_description = '$description'
                WHERE dialplan_uuid = '$dialplan_id'";
            $resultQuery = pg_query($con, $updateQuery);
            if ($resultQuery) {
                echo json_encode([
                    "msg"     => 'Dialplan Inbound Updated Successfully !!',
                ]);
                return;
            } else {
                echo json_encode([

                    "msg"     => 'Failed to Update Dialplan Inbound, Try Again !!'
                ]);
                return;
            }       
        }

        public function delete($con, $id) {
            $query = "DELETE FROM public.v_dialplans WHERE dialplan_uuid = '$id'";
            $result = pg_query($con, $query);
            if ($result) {
                $queryTimeConditionSettings = "DELETE FROM public.v_dialplan_details WHERE dialplan_uuid = '$id'";
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
            } else {
                echo json_encode([
                    "message" => "Failed to Delete, Try Again !!"
                ]);            
                return;
            }
        }
    }
?>