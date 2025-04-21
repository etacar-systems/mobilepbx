<?php
    require("../../config/config.php");

    class Gateway {

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
            $query = 'SELECT * FROM public.v_gateways';
            $result = pg_query($con, $query);
            return $result;
        }

        public function fetch_gateway_by_id($con, $id) {
            $query = "SELECT * FROM public.v_gateways WHERE gateway_uuid = '$id'";
            $result = pg_query($con, $query);
            return $result;
        }

        public function fetch_gateway_by_name($con, $name) {
            $query = "SELECT * FROM public.v_gateways WHERE gateway = '$name'";
            $result = pg_query($con, $query);
            return $result;
        }

        public function post($con, $uuidString, $domain_id, $gateway_name, $username, $password, $realm, $from_user, $proxy, $expire_seconds, $register, $retry_seconds, $profile, $gateway_enabled, $context, $description, $userID,$caller_id_in_from,$register_transport) {
            $insertQuery = "INSERT INTO public.v_gateways (gateway_uuid, domain_uuid, gateway, username, password, realm, from_user, proxy, expire_seconds, register, retry_seconds, sip_cid_type, profile, enabled, context, description, insert_user, caller_id_in_from, register_transport) VALUES ('$uuidString', '$domain_id', '$gateway_name', '$username', '$password', '$realm', '$from_user', '$proxy', '$expire_seconds', '$register', '$retry_seconds', 'pid', '$profile', '$gateway_enabled', '$context', '$description', '$userID', '$caller_id_in_from','$register_transport')";
            $resultQuery = pg_query($con, $insertQuery);
            if ($resultQuery) {
                echo json_encode([
                    "message" => "Gateway Created Successfully !!",
                    "id"      => $uuidString
                ]);            
                return;
            } else {
                echo json_encode([
                    "message" => "Failed to Create Gateway, Try Again !!"
                ]);            
                return;
            }    
        }

        public function update($con, $gateway_id, $gateway_name, $username, $password, $realm, $from_user, $proxy, $expire_seconds, $register, $retry_seconds, $profile, $gateway_enabled, $context, $description, $caller_id_in_from,$register_transport) {
            $editQuery = "UPDATE public.v_gateways SET 
                gateway = '$gateway_name',
                username = '$username',
                password = '$password',
                realm = '$realm',
                from_user = '$from_user',
                proxy = '$proxy',
                expire_seconds = '$expire_seconds',
                register = '$register',
                retry_seconds = '$retry_seconds',
                profile = '$profile',
                enabled = '$gateway_enabled',
                context = '$context',
                register_transport = '$register_transport',
                description = '$description',
		caller_id_in_from = '$caller_id_in_from'
                WHERE gateway_uuid = '$gateway_id'";
            $resultQuery = pg_query($con, $editQuery);
            if ($resultQuery) {
                echo json_encode([
                    "message" => "Gateway Updated Successfully !!"
                ]);            
                return;
            } else {
                echo json_encode([
                    "message" => "Failed to Update Gateway, Try Again !!"
                ]);            
                return;
            }     
        }

        public function delete($con, $id) {
            $query = "DELETE FROM public.v_gateways WHERE gateway_uuid = '$id'";
            $result = pg_query($con, $query);
            if ($result) {
                echo json_encode([
                    "message" => "Gateway Deleted Successfully !!"
                ]);            
                return;
            } else {
                echo json_encode([
                    "message" => "Failed to Delete Gateway, Try Again !!"
                ]);            
                return;
            }
        }

    }
?>
