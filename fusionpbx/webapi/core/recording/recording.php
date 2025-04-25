<?php
    require("../../config/config.php");

    class Recording {

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
            $query = 'SELECT v_recordings.*,v_domains.domain_name FROM public.v_recordings
            JOIN public.v_domains
            ON v_recordings.domain_uuid = v_domains.domain_uuid';
            $result = pg_query($con, $query);
            return $result;
        }

        public function fetch_by_domain($con, $id) {
            $query = "SELECT v_recordings.*,v_domains.domain_name FROM public.v_recordings 
            JOIN public.v_domains
            ON v_recordings.domain_uuid = v_domains.domain_uuid 
            WHERE v_recordings.domain_uuid = '$id'";
            $result = pg_query($con, $query);
            return $result;
        }

        public function fetch_by_id($con, $id) {
            $query = "SELECT v_recordings.*,v_domains.domain_name FROM public.v_recordings 
            JOIN public.v_domains
            ON v_recordings.domain_uuid = v_domains.domain_uuid 
            WHERE v_recordings.recording_uuid = '$id'";
            $result = pg_query($con, $query);
            return $result;
        }

        public function fetch_recording_pin_by_domain($con, $id) {
            $query = "SELECT dialplan_detail_data
            FROM public.v_dialplans JOIN public.v_dialplan_details 
            ON v_dialplans.dialplan_uuid = v_dialplan_details.dialplan_uuid
            WHERE v_dialplans.dialplan_name = 'recordings' AND v_dialplan_details.dialplan_detail_data LIKE '%pin_number=%' AND v_dialplan_details.dialplan_detail_type = 'set' AND v_dialplans.domain_uuid = '$id'";
            $result = pg_query($con, $query);
            return $result;
        }

        public function post($con, $domain_name, $name, $fileName, $description, $uuidRecording, $userID,$domain) {
            if (empty(trim($name))) {
                echo json_encode([
                    "msg"     => 'Recording Name cannot be EMPTY !'
                ]);
                return;
            } elseif (empty(trim($description))) {
                echo json_encode([
                    "msg"     => 'Description cannot be EMPTY !'
                ]);
                return;
            } elseif (empty(trim($domain_name))) {
                echo json_encode([
                    "msg"     => 'Please Select Domain !'
                ]);
                return;
            }

            // $userID = '3d7c90a5-3936-422a-8fac-4dbfbea35237';
            $date = date('Y-m-d H:i:s');
            $insertRecording = "INSERT INTO public.v_recordings (recording_uuid, domain_uuid, recording_filename, recording_name, recording_description, insert_user,insert_date) VALUES ('$uuidRecording', '$domain_name', '$fileName', '$name', '$description', '$userID','$date')";
            $resultRecording = pg_query($con, $insertRecording);
		
            if ($resultRecording) {
                echo json_encode([
                    "message" => "Recording Added Successfully !!",
                    "id"      => $uuidRecording,
		    "recording_url" => "https://mobilepbx.mobiililinja.fi/ext_storage/recordings/".$domain."/".$fileName,
		    "recording_filename" => $fileName
                ]);            
                return;
            } else {
                echo json_encode([
                    "message" => "Failed to Add Recording, Try Again !!"
                ]);            
                return;
            }       
        }

        public function update($con, $domain_name, $name, $fileName, $description, $recording_id, $userID,$domain) {
            if (empty(trim($name))) {
                echo json_encode([
                    "msg"     => 'Recording Name cannot be EMPTY !'
                ]);
                return;
            } elseif (empty(trim($description))) {
                echo json_encode([
                    "msg"     => 'Description cannot be EMPTY !'
                ]);
                return;
            } elseif (empty(trim($domain_name))) {
                echo json_encode([
                    "msg"     => 'Please Select Domain !'
                ]);
                return;
            }

            $fetchRecording = "SELECT * FROM public.v_recordings WHERE recording_uuid = '$recording_id'";
            $result = pg_query($con, $fetchRecording);

            if (pg_num_rows($result) > 0) {
                $rowRecording = pg_fetch_assoc($result);

                if(strlen($fileName) > 0){
                    $target_dir = "../../../../../lib/freeswitch/recordings/".$domain."/".$rowRecording['recording_filename'];
                    $target_dir_second = "../../../ext_storage/recordings/".$domain."/".$rowRecording['recording_filename'];

                    if (file_exists($target_dir)) {
                        unlink($target_dir);
                    }

                    if (file_exists($target_dir_second)) {
                        unlink($target_dir_second);
                    }
                }else{
                    $fileName = $rowRecording['recording_filename'];
                }

                $date = date('Y-m-d H:i:s');

                $editRecording = "UPDATE public.v_recordings SET 
                recording_filename = '$fileName', 
                recording_name = '$name', 
                recording_description = '$description',
                update_date = '$date'
                WHERE recording_uuid = '$recording_id'";
                $resultRecording = pg_query($con, $editRecording);


                if ($resultRecording) {
                echo json_encode([
                    "message" => "Recording Added Successfully !!",
                    "id"      => $recording_id,
                    "recording_url" => "https://mobilepbx.mobiililinja.fi/ext_storage/recordings/".$domain."/".$fileName,
                    "recording_filename" => $fileName
                ]);            
                return;
            } else {
                echo json_encode([
                    "message" => "Failed to Add Recording, Try Again !!"
                ]);            
                return;
            }    

            }else {
                echo json_encode([
                    "message" => "Failed to Find Recording, Try Again !!"
                ]);            
                return;
            }   
        }

        public function delete($con, $id) {
            $fetchRecording = "SELECT * FROM public.v_recordings WHERE recording_uuid = '$id'";
            $result = pg_query($con, $fetchRecording);
            if (pg_num_rows($result) > 0) {
                $rowRecording = pg_fetch_assoc($result);
                $fetchDomain = "SELECT * FROM public.v_domains WHERE domain_uuid = '".$rowRecording['domain_uuid']."'";
                $resultDomain = pg_query($con, $fetchDomain);
                if (pg_num_rows($resultDomain) > 0) {
                    $rowDomain = pg_fetch_assoc($resultDomain);
                    $target_dir = "../../../../../lib/freeswitch/recordings/".$rowDomain['domain_name']."/".$rowRecording['recording_filename'];
                    $target_dir_second = "../../../ext_storage/recordings/".$rowDomain['domain_name']."/".$rowRecording['recording_filename'];

                    $query = "DELETE FROM public.v_recordings WHERE recording_uuid = '$id'";
                    $resultDelete = pg_query($con, $query);
                    if ($resultDelete) {

                        if (file_exists($target_dir)) {
                            unlink($target_dir);
                        }

                        if (file_exists($target_dir_second)) {
                            unlink($target_dir_second);
                        }

                        echo json_encode([
                            "message" => "Recording Deleted Successfully !!"
                        ]);            
                        return;
                    
                    } else {
                        echo json_encode([
                            "message" => "Failed to Delete Recording, Try Again !!"
                        ]);            
                        return;
                    }
                } else {
                    echo json_encode([
                        "message" => "Failed to Find Recording, Try Again !!"
                    ]);            
                    return;
                }
            } else {
                echo json_encode([
                    "message" => "Failed to Find Recording, Try Again !!"
                ]);            
                return;
            }
        }

        public function fetch_namelist($con, $id) {
            $query = "SELECT recording_filename as recording_filename, recording_uuid  as uuid, recording_name as name, 'lua' as app, concat('streamfile.lua', recording_filename) AS data FROM public.v_recordings
            JOIN public.v_domains
            ON v_domains.domain_uuid = v_recordings.domain_uuid
            WHERE v_recordings.domain_uuid = '$id' 
            ORDER BY recording_filename ASC";
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
