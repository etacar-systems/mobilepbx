<?php
    require("../../config/config.php");
    require("../classes/SocketConnection.php");
    use Ramsey\Uuid\Uuid;

    class Extension {

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
            $query = 'SELECT * FROM public.v_extensions
            JOIN public.v_domains
            ON v_domains.domain_uuid = v_extensions.domain_uuid';
            $result = pg_query($con, $query);
            return $result;
        }

    	// Date :07-08-24 Extension uuid
    	public function fetch_extension_by_uuid($con, $id) {
    		$query= "SELECT * FROM public.v_extensions
            JOIN public.v_domains
            ON v_domains.domain_uuid = v_extensions.domain_uuid where v_extensions.extension_uuid='$id'";
    		$result = pg_query($con,$query);
    		return $result;
    		}
    	// END

        public function fetch_by_domain($con, $id) {
            $query = "SELECT * FROM public.v_extensions
            JOIN public.v_domains
            ON v_domains.domain_uuid = v_extensions.domain_uuid
            WHERE v_extensions.domain_uuid = '$id'";
            $result = pg_query($con, $query);
            return $result;
        }

        public function post($con, $extension, $user, $voicemail_password, $account_code, $outbound_caller_id_name, $outbound_caller_id_number, $effective_caller_id_name, $effective_caller_id_number, $emergency_caller_id_name, $emergency_caller_id_number, $max_registrations, $limit_max, $user_record, $domain, $context, $description, $extension_enabled, $uuidExtension, $uuidExtensionUser, $userID) {
            if (empty(trim($extension))) {
                echo json_encode([
                    "msg"     => 'Extension cannot be EMPTY !'
                ]);
                return;
            } 
            // elseif (empty(trim($user))) {
            //     echo json_encode([
            //         "msg"     => 'Please Select User !'
            //     ]);
            //     return;
            // }
             elseif (empty(trim($voicemail_password))) {
                echo json_encode([
                    "msg"     => 'Voicemail Password cannot be EMPTY !'
                ]);
                return;
            } elseif (empty(trim($account_code))) {
                echo json_encode([
                    "msg"     => 'Account Code cannot be EMPTY !'
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
            //} elseif (empty(($description))) {
            //    echo json_encode([
            //        "msg"     => 'Description cannot be EMPTY !'
            //    ]);
                return;
            } elseif (empty(($max_registrations))) {
                echo json_encode([
                    "msg"     => 'Max Registraion cannot be EMPTY !'
                ]);
                return;
            } elseif (empty(($limit_max))) {
                echo json_encode([
                    "msg"     => 'Limit Max cannot be EMPTY !'
                ]);
                return;
            } 

            // $userID = '3d7c90a5-3936-422a-8fac-4dbfbea35237';
            $insertExtension = "INSERT INTO public.v_extensions (extension_uuid, domain_uuid, extension, password, accountcode, outbound_caller_id_name, outbound_caller_id_number, effective_caller_id_name, effective_caller_id_number, emergency_caller_id_name, emergency_caller_id_number, directory_visible, directory_exten_visible, max_registrations, limit_max, limit_destination, user_context, call_timeout, call_screen_enabled, user_record, extension_type, enabled, description, insert_user) VALUES ('$uuidExtension', '$domain', '$extension', '$voicemail_password', '$account_code', '$outbound_caller_id_name', '$outbound_caller_id_number', '$effective_caller_id_name', '$effective_caller_id_number', '$emergency_caller_id_name', '$emergency_caller_id_number', 'true', 'true', '$max_registrations', '$limit_max', '!USER_BUSY', '$context', 30, 'false', '$user_record', 'default', $extension_enabled, '$description', '$userID')";
            $resultExtension = pg_query($con, $insertExtension);
            if ($resultExtension) {
                // $insertExtensionUser = "INSERT INTO public.v_extension_users (extension_user_uuid, extension_uuid, domain_uuid, user_uuid, insert_user) VALUES ('$uuidExtensionUser', '$uuidExtension', '$domain', '$user', '$userID')";
                // $resultExtensionUser = pg_query($con, $insertExtensionUser);
                // if ($resultExtensionUser) {

                $voicemail_uuid = Uuid::uuid4()->toString();

                $insertVoiceMail = "INSERT INTO public.v_voicemails (voicemail_uuid, domain_uuid, voicemail_id, voicemail_password, insert_user, voicemail_enabled) VALUES ('$voicemail_uuid', '$domain', '$extension', '$voicemail_password', '$userID','true')";
                $resultVoiceMail = pg_query($con, $insertVoiceMail);

                if ("/var/lib/freeswitch/storage/voicemail/default/".$context."/".$extension) {
                    mkdir("/var/lib/freeswitch/storage/voicemail/default/".$context."/".$extension, 0770, true);
                }

                $fp = SocketConnection::_event_socket_create();
                $json = SocketConnection::_event_socket_request($fp, "reloadacl");

                echo json_encode([
                    "msg"     => 'Extension Created Successfully !!',
                    "id"      => $uuidExtension,
                ]);
                return;
                
            } else {
                echo json_encode([

                    "msg"     => 'Failed to Create Extension, Try Again !!'
                ]);
                return;
            }       
        }

        public function update($con, $extension_id, $extension, $voicemail_password, $account_code, $outbound_caller_id_name, $outbound_caller_id_number, $effective_caller_id_name, $effective_caller_id_number, $emergency_caller_id_name, $emergency_caller_id_number, $max_registrations, $limit_max, $user_record, $domain, $context, $description, $extension_enabled) {
            if (empty(trim($extension))) {
                echo json_encode([
                    "msg"     => 'Extension Number cannot be EMPTY !'
                ]);
                return;
            } elseif (empty(trim($extension_id))) {
                echo json_encode([
                    "msg"     => 'Extension UUID cannot be EMPTY !'
                ]);
                return;
            } elseif (empty(trim($voicemail_password))) {
                echo json_encode([
                    "msg"     => 'Extension Password cannot be EMPTY !'
                ]);
                return;
            } elseif (empty(trim($account_code))) {
                echo json_encode([
                    "msg"     => 'Account Code cannot be EMPTY !'
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
           // } elseif (empty(($description))) {
            //    echo json_encode([
             //       "msg"     => 'Description cannot be EMPTY !'
              //  ]);
              //  return;
            } elseif (empty(($max_registrations))) {
                echo json_encode([
                    "msg"     => 'Max Registraion cannot be EMPTY !'
                ]);
                return;
            } elseif (empty(($limit_max))) {
                echo json_encode([
                    "msg"     => 'Limit Max cannot be EMPTY !'
                ]);
                return;
            } 

            $updateExtension = "UPDATE public.v_extensions SET 
            extension = '$extension', 
            password = '$voicemail_password', 
            accountcode = '$account_code', 
            outbound_caller_id_name = '$outbound_caller_id_name', 
            outbound_caller_id_number = '$outbound_caller_id_number', 
            effective_caller_id_name = '$effective_caller_id_name', 
            effective_caller_id_number = '$effective_caller_id_number', 
            emergency_caller_id_name = '$emergency_caller_id_name', 
            emergency_caller_id_number = '$emergency_caller_id_number', 
            max_registrations = '$max_registrations', 
            limit_max = '$limit_max', 
            user_record = '$user_record', 
            user_context = '$context', 
            enabled = '$extension_enabled',
            description = '$description'
            WHERE extension_uuid = '$extension_id'";
            
            $resultExtension = pg_query($con, $updateExtension);
            if ($resultExtension) {

                // $updateVoiceMail = "UPDATE public.v_voicemails SET  
                // voicemail_password = '$voicemail_password', 
                // WHERE  voicemail_id = '$extension' ";

                // $resultVoiceMail = pg_query($con, $updateVoiceMail);

                if ("/var/lib/freeswitch/storage/voicemail/default/".$context."/".$extension) {
                    mkdir("/var/lib/freeswitch/storage/voicemail/default/".$context."/".$extension, 0770, true);
                }

                $fp = SocketConnection::_event_socket_create();
                $json = SocketConnection::_event_socket_request($fp, "reloadacl");

                echo json_encode([
                    "msg"     => 'Extension Updated Successfully !!',
                ]);
                return;
            } else {
                echo json_encode([

                    "msg"     => 'Failed to Update Extension, Try Again !!'
                ]);
                return;
            }       
        }

        public function update_call_forward($con, $extension_id, $call_forward_enabled, $call_forward_destination, $on_busy_enabled, $on_busy_destination, $on_answer_enabled, $on_answer_destination, $not_register_enabled, $not_register_destination, $do_not_disturb_enabled) {
            if ($call_forward_enabled == "true" || $call_forward_enabled == "false") {
                if ($call_forward_enabled == "true" && $call_forward_destination == "") {
                    echo json_encode([
                        "msg"     => 'Call Forward Destination cannot be EMPTY !'
                    ]);
                    return;
                }

            } else {
                echo json_encode([
                    "msg"     => 'Call Foward Either be True or False !'
                ]);
                return;
            }

            if ($on_busy_enabled == "true" || $on_busy_enabled == "false") {
                if ($on_busy_enabled == "true" && $on_busy_destination == "") {
                    echo json_encode([
                        "msg"     => 'On Buy cannot be EMPTY !'
                    ]);
                    return;
                }

            } else {
                echo json_encode([
                    "msg"     => 'On Busy Either be True or False !'
                ]);
                return;
            }

            if ($on_answer_enabled == "true" || $on_answer_enabled == "false") {
                if ($on_answer_enabled == "true" && $on_answer_destination == "") {
                    echo json_encode([
                        "msg"     => 'No Answer cannot be EMPTY !'
                    ]);
                    return;
                }

            } else {
                echo json_encode([
                    "msg"     => 'No Answer Either be True or False !'
                ]);
                return;
            }

            if ($not_register_enabled == "true" || $not_register_enabled == "false") {
                if ($not_register_enabled == "true" && $not_register_destination == "") {
                    echo json_encode([
                        "msg"     => 'Not Register cannot be EMPTY !'
                    ]);
                    return;
                }

            } else {
                echo json_encode([
                    "msg"     => 'Not Register Either be True or False !'
                ]);
                return;
            }

            if ($do_not_disturb_enabled == "true" || $do_not_disturb_enabled == "false") {
                $updateQuery = "UPDATE public.v_extensions SET
                    do_not_disturb = '$do_not_disturb_enabled',
                    forward_all_enabled = '$call_forward_enabled',
                    forward_all_destination = '$call_forward_destination',
                    forward_busy_enabled = '$on_busy_enabled',
                    forward_busy_destination = '$on_busy_destination',
                    forward_no_answer_enabled = '$on_answer_enabled',
                    forward_no_answer_destination = '$on_answer_destination',
                    forward_user_not_registered_enabled = '$not_register_enabled',
                    forward_user_not_registered_destination = '$not_register_destination'
                    WHERE extension_uuid = '$extension_id'";
                $resultQuery = pg_query($con, $updateQuery);
                if ($resultQuery) {
                    echo json_encode([
                        "msg"     => 'Call Forwarding Updated Successfully !!',
                    ]);
                    return;
                } else {
                    echo json_encode([

                        "msg"     => 'Failed to Update Call Forwarding, Try Again !!'
                    ]);
                    return;
                }

            } else {
                echo json_encode([
                    "msg"     => 'Do Not Disturb Either be True or False !'
                ]);
                return;
            }

            
                   
        }

        public function updateSettings($con, $extension, $email, $voicemail_enabled, $voicemail_timeout,$domain_id,$extension_id) {
            if (empty(trim($extension))) {
                echo json_encode([
                    "msg"     => 'Extension cannot be EMPTY !'
                ]);
                return;
            } 

            if (empty(trim($domain_id))) {
                echo json_encode([
                    "msg"     => 'Domain UUID cannot be EMPTY !'
                ]);
                return;
            } 

            $updateExtension = "UPDATE public.v_extensions SET 
            call_timeout = '$voicemail_timeout'
            WHERE extension_uuid = '$extension_id'";
            
            $resultExtension = pg_query($con, $updateExtension);

            $updateVoiceMail = "UPDATE public.v_voicemails SET  
                voicemail_enabled = '$voicemail_enabled', 
                voicemail_mail_to = '$email'
                WHERE  voicemail_id = '$extension' and domain_uuid = '$domain_id' ";

            $resultVoiceMail = pg_query($con, $updateVoiceMail);

            if ($resultExtension) {
                echo json_encode([
                    "msg"     => 'Extension Updated Successfully !!',
                ]);
                return;
            } else {
                echo json_encode([

                    "msg"     => 'Failed to Update Extension, Try Again !!'
                ]);
                return;
            }       
        }

        public function delete($con, $id) {
            $query = "DELETE FROM public.v_extensions WHERE extension_uuid = '$id'";
            $result = pg_query($con, $query);
            if ($result) {
                $queryExtensionUser = "DELETE FROM public.v_extension_users WHERE extension_uuid = '$id'";
                $resultExtensionUser = pg_query($con, $queryExtensionUser);
                if ($resultExtensionUser) {
                    echo json_encode([
                        "message" => "Extension Deleted Successfully !!"
                    ]);            
                    return;
                } else {
                    echo json_encode([
                        "message" => "Failed to Delete Extension, Try Again !!"
                    ]);            
                    return;
                }
            } else {
                echo json_encode([
                    "message" => "Failed to Delete Extension, Try Again !!"
                ]);            
                return;
            }
        }

        public function fetch_namelist($con, $id) {
            $query = "SELECT extension as extension, extension_uuid as uuid, extension as name, 'transfer' as app, concat(extension, ' XML ',v_domains.domain_name) AS data FROM public.v_extensions
            JOIN public.v_domains
            ON v_domains.domain_uuid = v_extensions.domain_uuid
            WHERE v_extensions.domain_uuid = '$id' 
            ORDER BY extension ASC";
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
