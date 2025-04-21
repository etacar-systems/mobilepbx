<?php
    require("../../config/config.php");

    class Call_center {

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
            $query = 'SELECT * FROM public.v_call_center_queues';
            $result = pg_query($con, $query);
            return $result;
        }

        public function fetch_call_center_by_id($con, $id) {
            $query = "SELECT * FROM public.v_call_center_queues WHERE call_center_queue_uuid = '$id'";
            $result = pg_query($con, $query);
            return $result;
        }

        public function fetch_call_center_by_domain($con, $id) {
            $query = "SELECT * FROM public.v_call_center_queues WHERE domain_uuid = '$id'";
            $result = pg_query($con, $query);
            return $result;
        }

        public function post($con, $uuidString, $domain_id, $name, $extension, $greeting, $strategy, $music_on_hold, $record, $time_base_score, $time_base_score_seconds, $max_wait_time, $max_wait_time_no_agent, $max_wait_time_no_agent_time_reach, $timeout_action, $tier_rules_apply, $tier_rules_wait_second, $tier_rules_wait_multiply_level, $tier_rules_no_agent_no_wait, $discard_abondoned_after, $resume_allow, $caller_id_name_prefix, $announce_sound, $announce_frequency, $exit_key, $description, $userID) {
            
            if (empty(trim($name))) {
                echo json_encode([
                    "msg"     => 'Call Center Queue Name cannot be EMPTY !'
                ]);
                return;
            } elseif (empty(trim($extension))) {
                echo json_encode([
                    "msg"     => 'Call Center Extension cannot be EMPTY !'
                ]);
                return;
            }
            
            
            $insertQuery = "INSERT INTO public.v_call_center_queues(call_center_queue_uuid, domain_uuid, queue_name, queue_extension, queue_greeting, queue_strategy, queue_moh_sound, queue_record_template, queue_time_base_score, queue_time_base_score_sec, queue_max_wait_time, queue_max_wait_time_with_no_agent, queue_max_wait_time_with_no_agent_time_reached, queue_tier_rules_apply, queue_tier_rule_wait_second, queue_tier_rule_no_agent_no_wait, queue_discard_abandoned_after, queue_abandoned_resume_allowed, queue_tier_rule_wait_multiply_level, queue_cid_prefix, queue_announce_sound, queue_announce_frequency, queue_cc_exit_keys, queue_description, insert_user)
            VALUES ('$uuidString', '$domain_id', '$name', '$extension', '$greeting', '$strategy', '$music_on_hold', '$record', '$time_base_score', '$time_base_score_seconds', '$max_wait_time', '$max_wait_time_no_agent', '$max_wait_time_no_agent_time_reach', '$tier_rules_apply', '$tier_rules_wait_second', '$tier_rules_no_agent_no_wait', '$discard_abondoned_after', '$resume_allow', 'true', '$caller_id_name_prefix', '$announce_sound', '$announce_frequency', '$exit_key', '$description', '$userID')";
            $resultQuery = pg_query($con, $insertQuery);
            if ($resultQuery) {
                echo json_encode([
                    "message" => "Call Center Successfully !!",
                    "id"      => $uuidString
                ]);            
                return;
            } else {
                echo json_encode([
                    "message" => "Failed to Create Call Center, Try Again !!"
                ]);            
                return;
            }    
        }

        public function update($con, $call_center_id, $domain_id, $name, $extension, $greeting, $strategy, $music_on_hold, $record, $time_base_score, $time_base_score_seconds, $max_wait_time, $max_wait_time_no_agent, $max_wait_time_no_agent_time_reach, $timeout_action, $tier_rules_apply, $tier_rules_wait_second, $tier_rules_wait_multiply_level, $tier_rules_no_agent_no_wait, $discard_abondoned_after, $resume_allow, $caller_id_name_prefix, $announce_sound, $announce_frequency, $exit_key, $description) {
            
            if (empty(trim($name))) {
                echo json_encode([
                    "msg"     => 'Call Center Queue Name cannot be EMPTY !'
                ]);
                return;
            } elseif (empty(trim($extension))) {
                echo json_encode([
                    "msg"     => 'Call Center Extension cannot be EMPTY !'
                ]);
                return;
            }

            $editQuery = "UPDATE public.v_call_center_queues SET
                domain_uuid = '$domain_id',
                queue_name = '$name',
                queue_extension = '$extension',
                queue_greeting = '$greeting',
                queue_strategy = '$strategy',
                queue_moh_sound = '$music_on_hold',
                queue_record_template = '$record',
                queue_time_base_score = '$time_base_score',
                queue_time_base_score_sec = '$time_base_score_seconds',
                queue_max_wait_time = '$max_wait_time',
                queue_max_wait_time_with_no_agent = '$max_wait_time_no_agent',
                queue_max_wait_time_with_no_agent_time_reached = '$max_wait_time_no_agent_time_reach',
                queue_tier_rules_apply = '$tier_rules_apply',
                queue_tier_rule_wait_second = '$tier_rules_wait_second',
                queue_tier_rule_no_agent_no_wait = '$tier_rules_no_agent_no_wait',
                queue_discard_abandoned_after = '$discard_abondoned_after',
                queue_abandoned_resume_allowed = '$resume_allow',
                queue_cid_prefix = '$caller_id_name_prefix',
                queue_announce_sound = '$announce_sound',
                queue_announce_frequency = '$announce_frequency',
                queue_cc_exit_keys = '$exit_key',
                queue_description = '$description' 
                WHERE call_center_queue_uuid = '$call_center_id'";
            $resultQuery = pg_query($con, $editQuery);
            if ($resultQuery) {
                echo json_encode([
                    "message" => "Call Center Updated Successfully !!"
                ]);            
                return;
            } else {
                echo json_encode([
                    "message" => "Failed to Update Call Center, Try Again !!"
                ]);            
                return;
            }     
        }

        public function delete($con, $id) {
            $checkDialplan = "SELECT * FROM public.v_call_center_queues WHERE call_center_queue_uuid = '$id'";
            $resultCheckDialplan = pg_query($con, $checkDialplan);
            if (pg_num_rows($resultCheckDialplan) > 0) {
                $row = pg_fetch_assoc($resultCheckDialplan); 
                $dialplan_id = $row['dialplan_uuid'];
                $queryDeleteDialplan = "DELETE FROM public.v_dialplans WHERE dialplan_uuid = '$dialplan_id'";
                pg_query($con, $queryDeleteDialplan);
                $queryDeleteDialplanDetails = "DELETE FROM public.v_dialplan_details WHERE dialplan_uuid = '$dialplan_id'";
                pg_query($con, $queryDeleteDialplanDetails);
            }

            $query = "DELETE FROM public.v_call_center_queues WHERE call_center_queue_uuid = '$id'";
            $result = pg_query($con, $query);
            if ($result) {
                $queryDeleteCallCenterTier = "DELETE FROM public.v_call_center_tiers WHERE call_center_queue_uuid = '$id'";
                pg_query($con, $queryDeleteCallCenterTier);

                echo json_encode([
                    "message" => "Call Center Deleted Successfully !!"
                ]);            
                return;
            } else {
                echo json_encode([
                    "message" => "Failed to Delete Call Center, Try Again !!"
                ]);            
                return;
            }
        }

    }
?>