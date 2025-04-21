<?php
    require("../../config/config.php");

    class Device {

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
            $query = 'SELECT * FROM public.v_devices
            JOIN public.v_domains 
            ON v_devices.domain_uuid = v_domains.domain_uuid
            JOIN public.v_device_lines
            ON v_device_lines.device_uuid = v_devices.device_uuid';
            $result = pg_query($con, $query);
            return $result;
        }

        public function fetch_device_by_id($con, $id) {
            $query = "SELECT * FROM public.v_devices
            JOIN public.v_domains 
            ON v_devices.domain_uuid = v_domains.domain_uuid
            WHERE v_devices.device_uuid = '$id'";
            $result = pg_query($con, $query);
            return $result;
        }

        public function fetch_device_by_domain($con, $id) {
            $query = "SELECT * FROM public.v_devices
            JOIN public.v_domains 
            ON v_devices.domain_uuid = v_domains.domain_uuid
            WHERE v_devices.domain_uuid = '$id'";
            $result = pg_query($con, $query);
            return $result;
        }

        public function fetch_deviceline_by_id($con, $id) {
            $query = "SELECT * FROM public.v_device_lines WHERE device_line_uuid = '$id'";
            $result = pg_query($con, $query);
            return $result;
        }

        public function fetch_deviceline_by_device_id($con, $id) {
            $query = "SELECT * FROM public.v_device_lines WHERE device_uuid = '$id'";
            $result = pg_query($con, $query);
            return $result;
        }

        public function fetch_devicekey_by_id($con, $id) {
            $query = "SELECT * FROM public.v_device_keys WHERE device_key_uuid = '$id'";
            $result = pg_query($con, $query);
            return $result;
        }

        public function fetch_devicekey_by_device_id($con, $id) {
            $query = "SELECT * FROM public.v_device_keys WHERE device_uuid = '$id'";
            $result = pg_query($con, $query);
            return $result;
        }

        public function fetch_vendors($con) {
            $query = 'SELECT * FROM public.v_device_vendors';
            $result = pg_query($con, $query);
            return $result;
        }

        public function post($con, $uuidString, $domain_name, $device_enabled, $device_address, $device_label, $device_vendor, $device_template, $device_description, $device_userid, $userID) {
            if (empty(trim($domain_name))) {
                echo json_encode([
                    "msg"     => 'Domain cannot be EMPTY !'
                ]);
                return;
            } else if (empty(trim($device_address))) {
                echo json_encode([
                    "msg"     => 'Device Address cannot be EMPTY !'
                ]);
                return;
            } else if (empty(trim($device_label))) {
                echo json_encode([
                    "msg"     => 'Device Label cannot be EMPTY !'
                ]);
                return;
            } else if (empty(trim($device_vendor))) {
                echo json_encode([
                    "msg"     => 'Device Vendor cannot be EMPTY !'
                ]);
                return;
            } else if (empty(trim($device_template))) {
                echo json_encode([
                    "msg"     => 'Please Select Device Template !'
                ]);
                return;
            } else if (empty(trim($device_description))) {
                echo json_encode([
                    "msg"     => 'Device Dscription cannot be EMPTY !'
                ]);
                return;
            } else if (empty(trim($device_userid))) {
                echo json_encode([
                    "msg"     => 'Please Select User !'
                ]);
                return;
            }

            $insertDevice = "INSERT INTO public.v_devices (device_uuid, domain_uuid, device_address, device_label, device_vendor, device_enabled, device_template, device_description, device_user_uuid, insert_user) VALUES ('$uuidString', '$domain_name', '$device_address', '$device_label', '$device_vendor', '$device_enabled', '$device_template', '$device_description', '$device_userid', '$userID')";
            $resultDevice = pg_query($con, $insertDevice);
            if ($resultDevice) {
                echo json_encode([
                    "message" => "Device Created Successfully !!",
                    "id"      => $uuidString

                ]);            
                return;
            } else {
                echo json_encode([
                    "message" => "Failed to Create Device, Try Again !!"
                ]);            
                return;
            }                    
        }

        function post_deviceline($con, $uuidString, $device_id,  $domain_name, $deviceline_enabled, $device_linenumber, $device_server_address, $device_line_label, $device_line_displayname, $device_line_userid, $device_line_user_auth, $device_line_user_password, $device_line_port, $device_line_transport, $device_line_register_expire, $device_line_shared_line, $userID) {
            if (empty(trim($device_id))) {
                echo json_encode([
                    "msg"     => 'Device ID cannot be EMPTY !'
                ]);
                return;
            } elseif (empty(trim($domain_name))) {
                echo json_encode([
                    "msg"     => 'Domain cannot be EMPTY !'
                ]);
                return;
            } else if (empty(trim($device_linenumber))) {
                echo json_encode([
                    "msg"     => 'Device Line Number cannot be EMPTY !'
                ]);
                return;
            } else if (empty(trim($device_server_address))) {
                echo json_encode([
                    "msg"     => 'Server Address cannot be EMPTY !'
                ]);
                return;
            } else if (empty(trim($device_line_label))) {
                echo json_encode([
                    "msg"     => 'Line Label cannot be EMPTY !'
                ]);
                return;
            } else if (empty(trim($device_line_displayname))) {
                echo json_encode([
                    "msg"     => 'Display Name cannot be EMPTY !'
                ]);
                return;
            } else if (empty(trim($device_line_userid))) {
                echo json_encode([
                    "msg"     => 'User ID cannot be EMPTY !'
                ]);
                return;
            } else if (empty(trim($device_line_user_auth))) {
                echo json_encode([
                    "msg"     => 'User AUTH cannot be EMPTY !'
                ]);
                return;
            } else if (empty(trim($device_line_user_password))) {
                echo json_encode([
                    "msg"     => 'User Password cannot be EMPTY !'
                ]);
                return;
            } else if (empty(trim($device_line_port))) {
                echo json_encode([
                    "msg"     => 'Line Port cannot be EMPTY !'
                ]);
                return;
            } else if (empty(trim($device_line_transport))) {
                echo json_encode([
                    "msg"     => 'Line Transport cannot be EMPTY !'
                ]);
                return;
            } elseif (empty(trim($device_line_register_expire))) {
                $device_line_register_expire = 120;
            }  
            
            else {
                $insertDeviceLine = "INSERT INTO public.v_device_lines (device_line_uuid, device_uuid, domain_uuid, line_number, server_address, label, display_name, user_id, auth_id, password, sip_port, sip_transport, register_expires, shared_line, enabled, insert_user) VALUES ('$uuidString', '$device_id', '$domain_name', '$device_linenumber', '$device_server_address', '$device_line_label', '$device_line_displayname', '$device_line_userid', '$device_line_user_auth', '$device_line_user_password', '$device_line_port', '$device_line_transport', '$device_line_register_expire', '$device_line_shared_line', '$deviceline_enabled', '$userID')";
                $resultDeviceLine = pg_query($con, $insertDeviceLine);
                if ($resultDeviceLine) {
                    echo json_encode([
                        "message" => "Device Line Created Successfully !!",
                        "id"      => $uuidString

                    ]);            
                    return;
                } else {
                    echo json_encode([
                        "message" => "Failed to Create Device Line, Try Again !!"
                    ]);            
                    return;   
                }
            }
        }

        function post_devicekey($con, $uuidString, $device_id, $domain_name, $device_key_id, $device_key_category, $device_key_vendor, $device_key_type, $device_key_line, $device_key_value, $device_key_label, $userID) {
            if (empty(trim($device_id))) {
                echo json_encode([
                    "msg"     => 'Device ID cannot be EMPTY !'
                ]);
                return;
            } elseif (empty(trim($domain_name))) {
                echo json_encode([
                    "msg"     => 'Domain cannot be EMPTY !'
                ]);
                return;
            } else if (empty(trim($device_key_category))) {
                echo json_encode([
                    "msg"     => 'Device Key Category cannot be EMPTY !'
                ]);
                return;
            } else if (empty(trim($device_key_id))) {
                echo json_encode([
                    "msg"     => 'Device Key cannot be EMPTY !'
                ]);
                return;
            } else if (empty(trim($device_key_vendor))) {
                echo json_encode([
                    "msg"     => 'Device Key Vendor cannot be EMPTY !'
                ]);
                return;
            } else if (empty(trim($device_key_type))) {
                echo json_encode([
                    "msg"     => 'Device Key Type Name cannot be EMPTY !'
                ]);
                return;
            } else if (empty(trim($device_key_line))) {
                echo json_encode([
                    "msg"     => 'Device Key Line cannot be EMPTY !'
                ]);
                return;
            } else if (empty(trim($device_key_value))) {
                echo json_encode([
                    "msg"     => 'Device Key Value cannot be EMPTY !'
                ]);
                return;
            } else if (empty(trim($device_key_label))) {
                echo json_encode([
                    "msg"     => 'Device Key Label cannot be EMPTY !'
                ]);
                return;
            } 
            
            else {
                $insertDeviceKey = "INSERT INTO public.v_device_keys (device_key_uuid, device_uuid, domain_uuid, device_key_id, device_key_category, device_key_vendor, device_key_type, device_key_line, device_key_value , device_key_label, insert_user) VALUES ('$uuidString', '$device_id', '$domain_name', '$device_key_id', '$device_key_category', '$device_key_vendor', '$device_key_type', '$device_key_line', '$device_key_value', '$device_key_label', '$userID')";
                $resultDeviceKey = pg_query($con, $insertDeviceKey);
                if ($resultDeviceKey) {
                    echo json_encode([
                        "message" => "Device Key Created Successfully !!",
                        "id"      => $uuidString

                    ]);            
                    return;
                } else {
                    echo json_encode([
                        "message" => "Failed to Create Device Key, Try Again !!"
                    ]);            
                    return;   
                }
            }
        }

        public function update_device($con, $device_id, $device_enabled, $device_address, $device_label, $device_vendor, $device_template, $device_description, $device_userid) {
            if (empty(trim($device_address))) {
                echo json_encode([
                    "msg"     => 'Device Address cannot be EMPTY !'
                ]);
                return;
            } else if (empty(trim($device_label))) {
                echo json_encode([
                    "msg"     => 'Device Label cannot be EMPTY !'
                ]);
                return;
            } else if (empty(trim($device_vendor))) {
                echo json_encode([
                    "msg"     => 'Device Vendor cannot be EMPTY !'
                ]);
                return;
            } else if (empty(trim($device_template))) {
                echo json_encode([
                    "msg"     => 'Please Select Device Template !'
                ]);
                return;
            } else if (empty(trim($device_description))) {
                echo json_encode([
                    "msg"     => 'Device Dscription cannot be EMPTY !'
                ]);
                return;
            } else if (empty(trim($device_userid))) {
                echo json_encode([
                    "msg"     => 'Please Select User !'
                ]);
                return;
            }

            $editDevice = "UPDATE public.v_devices SET 
            device_address = '$device_address', 
            device_label = '$device_label', 
            device_vendor = '$device_vendor', 
            device_enabled = '$device_enabled', 
            device_template = '$device_template', 
            device_description = '$device_description',
            device_user_uuid = '$device_userid' WHERE device_uuid = '$device_id'";
            $resultDevice = pg_query($con, $editDevice);
            if ($resultDevice) {
                echo json_encode([
                    "message" => "Device Updated Successfully !!"
                ]);            
                return;
            } else {
                echo json_encode([
                    "message" => "Failed to Update Device, Try Again !!"
                ]);            
                return;
            }                    
        }

        public function update_device_line($con, $device_line_id, $device_linenumber, $device_server_address, $device_line_label, $device_line_displayname, $device_line_userid, $device_line_user_auth, $device_line_user_password, $device_line_port, $device_line_transport, $device_line_register_expire, $device_line_shared_line) {
            if (empty(trim($device_linenumber))) {
                echo json_encode([
                    "msg"     => 'Device Line Number cannot be EMPTY !'
                ]);
                return;
            } else if (empty(trim($device_server_address))) {
                echo json_encode([
                    "msg"     => 'Server Address cannot be EMPTY !'
                ]);
                return;
            } else if (empty(trim($device_line_label))) {
                echo json_encode([
                    "msg"     => 'Line Label cannot be EMPTY !'
                ]);
                return;
            } else if (empty(trim($device_line_displayname))) {
                echo json_encode([
                    "msg"     => 'Display Name cannot be EMPTY !'
                ]);
                return;
            } else if (empty(trim($device_line_userid))) {
                echo json_encode([
                    "msg"     => 'User ID cannot be EMPTY !'
                ]);
                return;
            } else if (empty(trim($device_line_user_auth))) {
                echo json_encode([
                    "msg"     => 'User AUTH cannot be EMPTY !'
                ]);
                return;
            } else if (empty(trim($device_line_user_password))) {
                echo json_encode([
                    "msg"     => 'User Password cannot be EMPTY !'
                ]);
                return;
            } else if (empty(trim($device_line_port))) {
                echo json_encode([
                    "msg"     => 'Line Port cannot be EMPTY !'
                ]);
                return;
            } else if (empty(trim($device_line_transport))) {
                echo json_encode([
                    "msg"     => 'Line Transport cannot be EMPTY !'
                ]);
                return;
            } elseif (empty(trim($device_line_register_expire))) {
                $device_line_register_expire = 120;
            } 


            $editDeviceLine = "UPDATE public.v_device_lines SET 
            line_number = '$device_linenumber',
            server_address = '$device_server_address',
            label = '$device_line_label',
            display_name = '$device_line_displayname',
            user_id = '$device_line_userid',
            auth_id = '$device_line_user_auth',
            password = '$device_line_user_password',
            sip_port = '$device_line_port',
            sip_transport = '$device_line_transport',
            register_expires = '$device_line_register_expire',
            shared_line = '$device_line_shared_line' WHERE device_line_uuid = '$device_line_id'";
            $resultDeviceLine = pg_query($con, $editDeviceLine);
            if ($resultDeviceLine) {
                echo json_encode([
                    "message" => "Device Line Updated Successfully !!"
                ]);            
                return;
            } else {
                echo json_encode([
                    "message" => "Failed to Update Device Line, Try Again !!"
                ]);            
                return;   
            }                  
        }

        function update_devicekey($con, $device_keyid, $domain_name, $device_key_id, $device_key_category, $device_key_vendor, $device_key_type, $device_key_line, $device_key_value, $device_key_label) {
            if (empty(trim($device_keyid))) {
                echo json_encode([
                    "msg"     => 'Device Key UUID cannot be EMPTY !'
                ]);
                return;
            } elseif (empty(trim($domain_name))) {
                echo json_encode([
                    "msg"     => 'Domain cannot be EMPTY !'
                ]);
                return;
            } else if (empty(trim($device_key_category))) {
                echo json_encode([
                    "msg"     => 'Device Key Category cannot be EMPTY !'
                ]);
                return;
            } else if (empty(trim($device_key_id))) {
                echo json_encode([
                    "msg"     => 'Device Key cannot be EMPTY !'
                ]);
                return;
            } else if (empty(trim($device_key_vendor))) {
                echo json_encode([
                    "msg"     => 'Device Key Vendor cannot be EMPTY !'
                ]);
                return;
            } else if (empty(trim($device_key_type))) {
                echo json_encode([
                    "msg"     => 'Device Key Type Name cannot be EMPTY !'
                ]);
                return;
            } else if (empty(trim($device_key_line))) {
                echo json_encode([
                    "msg"     => 'Device Key Line cannot be EMPTY !'
                ]);
                return;
            } else if (empty(trim($device_key_value))) {
                echo json_encode([
                    "msg"     => 'Device Key Value cannot be EMPTY !'
                ]);
                return;
            } else if (empty(trim($device_key_label))) {
                echo json_encode([
                    "msg"     => 'Device Key Label cannot be EMPTY !'
                ]);
                return;
            } 
            
            else {
                $updateDeviceKey = "UPDATE public.v_device_keys SET
                domain_uuid = '$domain_name', 
                device_key_id = '$device_key_id', 
                device_key_category = '$device_key_category', 
                device_key_vendor = '$device_key_vendor', 
                device_key_type = '$device_key_type', 
                device_key_line = '$device_key_line', 
                device_key_value  = '$device_key_line', 
                device_key_label = '$device_key_label'
                WHERE device_key_uuid = '$device_keyid'";
                $resultDeviceKey = pg_query($con, $updateDeviceKey);
                if ($resultDeviceKey) {
                    echo json_encode([
                        "message" => "Device Key Updated Successfully !!",
                    ]);            
                    return;
                } else {
                    echo json_encode([
                        "message" => "Failed to Update Device Key, Try Again !!"
                    ]);            
                    return;   
                }
            }
        }

        public function delete($con, $id) {
            $query = "DELETE FROM public.v_devices WHERE device_uuid = '$id'";
            $result = pg_query($con, $query);
            if ($result) {
                $queryDeviceLine = "DELETE FROM public.v_device_lines WHERE device_uuid = '$id'";
                $resultDeviceLine = pg_query($con, $queryDeviceLine);
                if ($resultDeviceLine) {
                    $queryDeviceKey = "DELETE FROM public.v_device_keys WHERE device_uuid = '$id'";
                    pg_query($con, $queryDeviceKey);
                    echo json_encode([
                        "message" => "Device Deleted Successfully !!"
                    ]);            
                    return;
                } else {
                    echo json_encode([
                        "message" => "Failed to Delete Device, Try Again !!"
                    ]);            
                    return;
                }
            } else {
                echo json_encode([
                    "message" => "Failed to Delete Device, Try Again !!"
                ]);            
                return;
            }
        }

        public function delete_deviceline($con, $id) {
            $queryDeviceLine = "DELETE FROM public.v_device_lines WHERE device_line_uuid = '$id'";
            $resultDeviceLine = pg_query($con, $queryDeviceLine);
            if ($resultDeviceLine) {
                echo json_encode([
                    "message" => "Device Line Deleted Successfully !!"
                ]);            
                return;
            } else {
                echo json_encode([
                    "message" => "Failed to Delete Device Line, Try Again !!"
                ]);            
                return;
            }
        }

        public function delete_devicekey($con, $id) {
            $queryDeviceLine = "DELETE FROM public.v_device_keys WHERE device_key_uuid = '$id'";
            $resultDeviceLine = pg_query($con, $queryDeviceLine);
            if ($resultDeviceLine) {
                echo json_encode([
                    "message" => "Device key Deleted Successfully !!"
                ]);            
                return;
            } else {
                echo json_encode([
                    "message" => "Failed to Delete Device Key, Try Again !!"
                ]);            
                return;
            }
        
        }
    }
?>