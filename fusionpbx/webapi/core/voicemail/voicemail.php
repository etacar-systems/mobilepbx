<?php
    require("../../config/config.php");

    class Voicemail {

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
            $query = 'SELECT * FROM public.v_voicemails
            JOIN public.v_domains
            ON v_domains.domain_uuid = v_voicemails.domain_uuid';
            $result = pg_query($con, $query);
            return $result;
        }

        public function fetch_by_id($con, $id) {
            $query = "SELECT * FROM public.v_voicemails
            JOIN public.v_domains
            ON v_domains.domain_uuid = v_voicemails.domain_uuid
            WHERE v_voicemails.voicemail_uuid = '$id'";
            $result = pg_query($con, $query);
            return $result;
        }

        public function fetch_by_user_id($con, $id) {
            $query = "SELECT * FROM public.v_voicemails
            JOIN public.v_domains
            ON v_domains.domain_uuid = v_voicemails.domain_uuid
            WHERE v_voicemails.insert_user = '$id'";
            $result = pg_query($con, $query);
            return $result;
        }

        public function fetch_greetings_by_voicemail_id($con, $id) {
            $query = "SELECT * FROM public.v_voicemail_greetings
            JOIN public.v_domains
            ON v_domains.domain_uuid = v_voicemail_greetings.domain_uuid
            WHERE v_voicemail_greetings.voicemail_id = '$id'";
            $result = pg_query($con, $query);
            return $result;
        }

        public function fetch_messages_by_id($con, $id) {
            $query = "SELECT * FROM public.v_voicemails
            JOIN public.v_domains
            ON v_domains.domain_uuid = v_voicemails.domain_uuid
            JOIN public.v_voicemail_messages
            ON v_voicemail_messages.voicemail_uuid = v_voicemails.voicemail_uuid
            WHERE v_voicemails.voicemail_uuid = '$id'";
            $result = pg_query($con, $query);
            return $result;
        }

        public function fetch_messages_by_message_id($con, $id) {
            $query = "SELECT * FROM public.v_voicemails
            JOIN public.v_domains
            ON v_domains.domain_uuid = v_voicemails.domain_uuid
            JOIN public.v_voicemail_messages
            ON v_voicemail_messages.voicemail_uuid = v_voicemails.voicemail_uuid
            WHERE v_voicemail_messages.voicemail_message_uuid = '$id'";
            $result = pg_query($con, $query);
            return $result;
        }

        public function fetch_by_domain($con, $id) {
            $query = "SELECT * FROM public.v_voicemails
            JOIN public.v_domains
            ON v_domains.domain_uuid = v_voicemails.domain_uuid
            WHERE v_voicemails.domain_uuid = '$id'";
            $result = pg_query($con, $query);
            return $result;
        }

        public function post($con, $voicemail_id, $voicemail_password, $domain, $alternate_greeting_id, $recording_instructions, $recording_options, $sent_voicemail_to, $description, $voicemail_enabled, $uuidVoiceMail, $userID) {
            if (empty(trim($voicemail_id))) {
                echo json_encode([
                    "msg"     => 'Voicemail ID cannot be EMPTY !'
                ]);
                return;
            } elseif (empty(trim($voicemail_password))) {
                echo json_encode([
                    "msg"     => 'Voicemail Password cannot be EMPTY !'
                ]);
                return;
            } elseif (empty(($domain))) {
                echo json_encode([
                    "msg"     => 'Please Select Domain !'
                ]);
                return;
            } elseif (empty(($description))) {
                echo json_encode([
                    "msg"     => 'Description cannot be EMPTY !'
                ]);
                return;
            } 

            // $userID = '3d7c90a5-3936-422a-8fac-4dbfbea35237';
            if ($alternate_greeting_id <= 0) {
                $insertVoiceMail = "INSERT INTO public.v_voicemails (voicemail_uuid, domain_uuid, voicemail_id, voicemail_password, voicemail_recording_instructions, voicemail_recording_options, voicemail_mail_to, voicemail_transcription_enabled, voicemail_file, voicemail_local_after_email, voicemail_enabled, voicemail_description, insert_user) VALUES ('$uuidVoiceMail', '$domain', '$voicemail_id', '$voicemail_password', '$recording_instructions', '$recording_options', '$sent_voicemail_to', 'false', 'attach', 'true', '$voicemail_enabled', '$description', '$userID')";

            } else {
                $insertVoiceMail = "INSERT INTO public.v_voicemails (voicemail_uuid, domain_uuid, voicemail_id, voicemail_password, voicemail_alternate_greet_id, voicemail_recording_instructions, voicemail_recording_options, voicemail_mail_to, voicemail_transcription_enabled, voicemail_file, voicemail_local_after_email, voicemail_enabled, voicemail_description, insert_user) VALUES ('$uuidVoiceMail', '$domain', '$voicemail_id', '$voicemail_password', '$alternate_greeting_id', '$recording_instructions', '$recording_options', '$sent_voicemail_to', 'false', 'attach', 'true', '$voicemail_enabled', '$description', '$userID')";
            }
            $resultVoiceMail = pg_query($con, $insertVoiceMail);
            if ($resultVoiceMail) {
                echo json_encode([
                    "msg"     => 'Voicemail Created Successfully !!',
                    "id"      => $uuidVoiceMail
                ]);
                return;
            } else {
                echo json_encode([
                    "msg"     => 'Failed to Create Voicemail, Try Again !!',
                ]);
                return;
            }       
        }

        public function update($con, $voicemail_password, $description, $voicemail_enabled, $voicemail_uuid) {
            if (empty(trim($voicemail_password))) {
                echo json_encode([
                    "msg"     => 'Voicemail Password cannot be EMPTY !'
                ]);
                return;
            }

                $updateVoiceMail = "UPDATE public.v_voicemails SET  
                voicemail_password = '$voicemail_password', 
                voicemail_enabled = '$voicemail_enabled', 
                voicemail_description = '$description'
                WHERE  voicemail_uuid = '$voicemail_uuid'";

            $resultVoiceMail = pg_query($con, $updateVoiceMail);
            if ($resultVoiceMail) {
                echo json_encode([
                    "msg"     => 'Voicemail Updated Successfully !!',
                ]);
                return;
            } else {
                echo json_encode([
                    "msg"     => 'Failed to Update Voicemail, Try Again !!',
                ]);
                return;
            }       
        }

        public function delete($con, $id) {
            $query = "DELETE FROM public.v_voicemails WHERE voicemail_uuid = '$id'";
            $result = pg_query($con, $query);
            
            if ($result) {
                pg_query($con, "DELETE FROM public.v_voicemail_options WHERE voicemail_uuid = '$id'");
                echo json_encode([
                    "message" => "Voicemail Deleted Successfully !!"
                ]);            
                return;
            
            } else {
                echo json_encode([
                    "message" => "Failed to Delete Voicemail, Try Again !!"
                ]);            
                return;
            }
        }

        public function delete_voicemail_msg($con, $id) {
            
            $checkMessages = "SELECT * FROM public.v_voicemails
            JOIN public.v_domains
            ON v_domains.domain_uuid = v_voicemails.domain_uuid
            JOIN public.v_voicemail_messages
            ON v_voicemail_messages.voicemail_uuid = v_voicemails.voicemail_uuid
            WHERE v_voicemail_messages.voicemail_message_uuid = '$id'";
            $resultCheckMessages = pg_query($con, $checkMessages);
            if (pg_num_rows($resultCheckMessages) > 0) {
                $row = pg_fetch_assoc($resultCheckMessages); 
                if (file_exists("../../../../../lib/freeswitch/storage/voicemail/default/".$row['domain_name']."/".$row['voicemail_id']."/msg_".$row['voicemail_message_uuid'].".wav")) {
                    unlink("../../../../../lib/freeswitch/storage/voicemail/default/".$row['domain_name']."/".$row['voicemail_id']."/msg_".$row['voicemail_message_uuid'].".wav");
                }
                
                if (file_exists("../../../ext_storage/voicemails/default/".$row['domain_name']."/".$row['voicemail_id']."/msg_".$row['voicemail_message_uuid'].".wav")) {
                    unlink("../../../ext_storage/voicemails/default/".$row['domain_name']."/".$row['voicemail_id']."/msg_".$row['voicemail_message_uuid'].".wav");
                }
            }

            $query = "DELETE FROM public.v_voicemail_messages WHERE voicemail_message_uuid = '$id'";
            $result = pg_query($con, $query);
            
            if ($result) {
                echo json_encode([
                    "message" => "Voicemail Message Deleted Successfully !!"
                ]);            
                return;
            
            } else {
                echo json_encode([
                    "message" => "Failed to Delete Voicemail Message, Try Again !!"
                ]);            
                return;
            }
        }

    }
?>