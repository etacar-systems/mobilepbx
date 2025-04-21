<?php
    require("../../config/config.php");

    class Stream {

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
            $query = 'SELECT * FROM public.v_streams
            JOIN public.v_domains
            ON v_streams.domain_uuid = v_domains.domain_uuid';
            $result = pg_query($con, $query);
            return $result;
        }

        public function fetch_by_id($con, $id) {
            $query = "SELECT * FROM public.v_streams
            JOIN public.v_domains
            ON v_streams.domain_uuid = v_domains.domain_uuid
            WHERE v_streams.stream_uuid = '$id'";
            $result = pg_query($con, $query);
            return $result;
        }

        public function fetch_by_domain($con, $id) {
            $query = "SELECT * FROM public.v_streams
            JOIN public.v_domains
            ON v_streams.domain_uuid = v_domains.domain_uuid
            WHERE v_streams.domain_uuid = '$id'";
            $result = pg_query($con, $query);
            return $result;
        }

        public function post($con, $name, $domain_name, $location, $description, $stream_enabled, $uuidStream, $userID) {
            if (empty(trim($name))) {
                echo json_encode([
                    "msg"     => 'Stream Name cannot be EMPTY !'
                ]);
                return;
            } elseif (empty(trim($location))) {
                echo json_encode([
                    "msg"     => 'Stream Location cannot be EMPTY !'
                ]);
                return;
            } elseif (empty(trim($description))) {
                echo json_encode([
                    "msg"     => 'Stream Description cannot be EMPTY !'
                ]);
                return;
            } elseif (empty(trim($domain_name))) {
                echo json_encode([
                    "msg"     => 'Please Select Domain !'
                ]);
                return;
            }

            // $userID = '3d7c90a5-3936-422a-8fac-4dbfbea35237';
            $insertStream = "INSERT INTO public.v_streams (stream_uuid, domain_uuid, stream_name, stream_location, stream_description, stream_enabled, insert_user) VALUES ('$uuidStream', '$domain_name', '$name', '$location', '$description', '$stream_enabled', '$userID')";
            $resultStream = pg_query($con, $insertStream);
            if ($resultStream) {
                echo json_encode([
                    "msg"     => 'Stream Created Successfully !!',
                    "id"      => $uuidStream
                ]);
                return;
            } else {
                echo json_encode([

                    "msg"     => 'Failed to Create Stream, Try Again !!'
                ]);
                return;
            }    
        }

        public function update($con, $name, $domain_name, $location, $description, $stream_enabled, $stream_id) {
            if (empty(trim($name))) {
                echo json_encode([
                    "msg"     => 'Stream Name cannot be EMPTY !'
                ]);
                return;
            } elseif (empty(trim($location))) {
                echo json_encode([
                    "msg"     => 'Stream Location cannot be EMPTY !'
                ]);
                return;
            } elseif (empty(trim($description))) {
                echo json_encode([
                    "msg"     => 'Stream Description cannot be EMPTY !'
                ]);
                return;
            } elseif (empty(trim($domain_name))) {
                echo json_encode([
                    "msg"     => 'Please Select Domain !'
                ]);
                return;
            }

            $editStream = "UPDATE public.v_streams SET
            domain_uuid = '$domain_name',
            stream_name = '$name',
            stream_location = '$location',
            stream_description = '$description',
            stream_enabled = '$stream_enabled'
            WHERE stream_uuid = '$stream_id'";
            $resultStream = pg_query($con, $editStream);
            if ($resultStream) {
                echo json_encode([
                    "msg"     => 'Stream Updated Successfully !!'
                ]);
                return;
            } else {
                echo json_encode([

                    "msg"     => 'Failed to Update Stream, Try Again !!'
                ]);
                return;
            }    
        }

        public function delete($con, $id) {
            $query = "DELETE FROM public.v_streams WHERE stream_uuid = '$id'";
            $result = pg_query($con, $query);
            if ($result) {
                echo json_encode([
                    "message" => "Stream Deleted Successfully !!"
                ]);            
                return;
            
            } else {
                echo json_encode([
                    "message" => "Failed to Delete Stream, Try Again !!"
                ]);            
                return;
            }
        }

    }
?>