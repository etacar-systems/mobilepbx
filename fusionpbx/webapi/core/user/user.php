<?php
    require("../../config/config.php");

    class User {

        public function generateRandomString($length = 32) {
            $characters = '0123456789abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ';
            $charactersLength = strlen($characters);
            $randomString = '';
            for ($i = 0; $i < $length; $i++) {
                $randomString .= $characters[rand(0, $charactersLength - 1)];
            }
            return $randomString;
        }

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
            $query = 'SELECT * FROM public.v_users
            JOIN public.v_user_groups
            ON v_user_groups.user_uuid = v_users.user_uuid
            JOIN public.v_domains
            ON v_domains.domain_uuid = v_users.domain_uuid';
            $result = pg_query($con, $query);
            return $result;
        }

        public function fetch_by_id($con, $id) {
            $query = "SELECT * FROM public.v_users
            JOIN public.v_user_groups
            ON v_user_groups.user_uuid = v_users.user_uuid
            JOIN public.v_domains
            ON v_domains.domain_uuid = v_users.domain_uuid
            WHERE v_users.user_uuid = '$id'";
            $result = pg_query($con, $query);
            return $result;
        }

        public function fetch_by_domain($con, $id) {
            $query = "SELECT * FROM public.v_users
            JOIN public.v_user_groups
            ON v_user_groups.user_uuid = v_users.user_uuid
            JOIN public.v_domains
            ON v_domains.domain_uuid = v_users.domain_uuid
            WHERE v_users.domain_uuid = '$id'";
            $result = pg_query($con, $query);
            return $result;
        }

	// Date : 13-Aug-2024 Added by Atul for get user list by domain
	   public function fetch_by_domain_dropdown($con, $id) {
            $query = "SELECT v_users.user_uuid,v_users.domain_uuid,v_users.username FROM public.v_users
            JOIN public.v_user_groups
            ON v_user_groups.user_uuid = v_users.user_uuid
            JOIN public.v_domains
            ON v_domains.domain_uuid = v_users.domain_uuid
            WHERE v_users.domain_uuid = '$id'";
            $result = pg_query($con, $query);
            return $result;
        }

	//END


        public function post($con, $username, $password, $confirm_password, $email, $language, $timezone, $first_name, $last_name, $organization, $groups, $groups_name, $domain, $user_enabled, $uuidContact, $uuidUser, $uuidUserGroup, $uuidUserSettingLanguage, $uuidUserSettingTimezone, $userID) {
            if (empty(trim($username))) {
                echo json_encode([
                    "msg"     => 'Username cannot be EMPTY !'
                ]);
                return;
            } elseif (empty(trim($password))) {
                echo json_encode([
                    "msg"     => 'Password cannot be EMPTY !'
                ]);
                return;
            } elseif (empty(trim($confirm_password))) {
                echo json_encode([
                    "msg"     => 'Confirm Password cannot be EMPTY !'
                ]);
                return;
            } elseif ((trim($password)) != trim($confirm_password)) {
                echo json_encode([
                    "msg"     => 'Both Passwords are not MATCH !'
                ]);
                return;
            } elseif (empty(trim($email))) {
                echo json_encode([
                    "msg"     => 'Email cannot be EMPTY !'
                ]);
                return;
            } elseif (empty(($language))) {
                echo json_encode([
                    "msg"     => 'Please Select Language !'
                ]);
                return;
            } elseif (empty(($timezone))) {
                echo json_encode([
                    "msg"     => 'Please Select Timezone !'
                ]);
                return;
            } elseif (empty(($first_name))) {
                echo json_encode([
                    "msg"     => 'First Name cannot be EMPTY !'
                ]);
                return;
            } elseif (empty(($organization))) {
                echo json_encode([
                    "msg"     => 'Organization Name cannot be EMPTY !'
                ]);
                return;
            }

            $checkDuplicateDomain = "SELECT * FROM public.v_users WHERE domain_uuid = '$domain' AND username = '$username'";
            $result = pg_query($con, $checkDuplicateDomain);
            if (pg_num_rows($result) > 0) {
                echo json_encode([
                    "msg"     => 'This User is Already Associaed with Selected Domain Name !'
                ]);
                return;
            } else {
                // $userID = '3d7c90a5-3936-422a-8fac-4dbfbea35237';
                $insertContact = "INSERT INTO public.v_contacts (contact_uuid, domain_uuid, contact_type, contact_organization, contact_name_given, contact_name_family, contact_nickname, insert_user) VALUES ('$uuidContact', '$domain', 'user', '$organization', '$first_name', '$last_name', '$username', '$userID')";
                $resultContact = pg_query($con, $insertContact);
                if ($resultContact) {
                    $hashedPassword = password_hash($confirm_password, PASSWORD_DEFAULT);
                    // Generate a random string of 32 characters
                    $randomKey = $this->generateRandomString();
                    
                    $insertUser = "INSERT INTO public.v_users (user_uuid, contact_uuid, domain_uuid, username, password, user_email, user_type, user_enabled, api_key, insert_user) VALUES ('$uuidUser', '$uuidContact', '$domain', '$username', '$hashedPassword', '$email', 'default', '$user_enabled', '$randomKey', '$userID')";
                    $resultUser = pg_query($con, $insertUser);
                    if ($resultUser) {
                        $insertUserGroup = "INSERT INTO public.v_user_groups (user_group_uuid, domain_uuid, group_name, group_uuid, user_uuid, insert_user) VALUES ('$uuidUserGroup', '$domain', '$groups_name', '$groups', '$uuidUser', '$userID')";
                        $resultUserGroup = pg_query($con, $insertUserGroup);
                        if ($resultUserGroup) {
                            $insertUserSettingTimezone = "INSERT INTO public.v_user_settings (user_setting_uuid, user_uuid, domain_uuid, user_setting_category, user_setting_subcategory, user_setting_name, user_setting_value, user_setting_enabled, insert_user) VALUES ('$uuidUserSettingTimezone', '$uuidUser', '$domain', 'domain', 'time_zone', 'name', '$timezone', '$user_enabled', '$userID')";
                            $resultUserSettingTimezone = pg_query($con, $insertUserSettingTimezone);
                            if ($resultUserSettingTimezone) {
                                $insertUserSettingLanguage = "INSERT INTO public.v_user_settings (user_setting_uuid, user_uuid, domain_uuid, user_setting_category, user_setting_subcategory, user_setting_name, user_setting_value, user_setting_enabled, insert_user) VALUES ('$uuidUserSettingLanguage', '$uuidUser', '$domain', 'domain', 'language', 'code', '$language', '$user_enabled', '$userID')";
                                $resultUserSettingLanguage = pg_query($con, $insertUserSettingLanguage);
                                if ($resultUserSettingLanguage) {
                                    echo json_encode([
                                        "msg"     => 'User Created Successfully !!',
                                        "id"      => $uuidUser,
                                        "api_key" => $randomKey,
                                    ]);
                                    return;
                                } else {
                                    echo json_encode([
                
                                        "msg"     => 'User Created But Failed to Add User Language Setting, Try Again !!'
                                    ]);
                                    return;
                                }
                            } else {
                                echo json_encode([
            
                                    "msg"     => 'User Created But Failed to Add User Timezone Setting, Try Again !!'
                                ]);
                                return;
                            }
                        } else {
                            echo json_encode([
        
                                "msg"     => 'User Created But Failed to Create User Group, Try Again !!'
                            ]);
                            return;
                        }
                    } else {
                        echo json_encode([
    
                            "msg"     => 'Failed to Create User, Try Again !!'
                        ]);
                        return;
                    }
                } else {
                    echo json_encode([

                        "msg"     => 'Failed to Create User Contact, Try Again !!'
                    ]);
                    return;
                }
            }        
        }

        public function update($con, $password, $confirm_password, $email, $language, $timezone, $groups, $groups_name, $user_enabled, $user_id) {
            if (empty(trim($password))) {
                echo json_encode([
                    "msg"     => 'Password cannot be EMPTY !'
                ]);
                return;
            } elseif (empty(trim($confirm_password))) {
                echo json_encode([
                    "msg"     => 'Confirm Password cannot be EMPTY !'
                ]);
                return;
            } elseif ((trim($password)) != trim($confirm_password)) {
                echo json_encode([
                    "msg"     => 'Both Passwords are not MATCH !'
                ]);
                return;
            } elseif (empty(trim($email))) {
                echo json_encode([
                    "msg"     => 'Email cannot be EMPTY !'
                ]);
                return;
            } elseif (empty(($language))) {
                echo json_encode([
                    "msg"     => 'Please Select Language !'
                ]);
                return;
            } elseif (empty(($timezone))) {
                echo json_encode([
                    "msg"     => 'Please Select Timezone !'
                ]);
                return;
            }

            $hashedPassword = password_hash($confirm_password, PASSWORD_DEFAULT);
            $editUser = "UPDATE public.v_users SET 
            password = '$hashedPassword',
            user_email = '$email',
            user_enabled = '$user_enabled'
            WHERE user_uuid = '$user_id'";
            $resultUser = pg_query($con, $editUser);
            if ($resultUser) {
                $editUserGroup = "UPDATE public.v_user_groups SET 
                group_name = '$groups_name',
                group_uuid = '$groups'
                WHERE user_uuid = '$user_id'";
                $resultUserGroup = pg_query($con, $editUserGroup);
                if ($resultUserGroup) {
                    $editUserSettingTimezone = "UPDATE public.v_user_settings SET user_setting_value = '$timezone' WHERE user_setting_subcategory = 'time_zone' AND  user_uuid = '$user_id'";
                    $resultUserSettingTimezone = pg_query($con, $editUserSettingTimezone);
                    if ($resultUserSettingTimezone) {
                        $editUserSettingLanguage = "UPDATE public.v_user_settings SET user_setting_value = '$language' WHERE user_setting_subcategory = 'language' AND  user_uuid = '$user_id'";
                        $resultUserSettingLanguage = pg_query($con, $editUserSettingLanguage);
                        if ($resultUserSettingLanguage) {
                            echo json_encode([
        
                                "msg"     => 'User Updated Successfully !!'
                            ]);
                            return;
                        } else {
                            echo json_encode([
        
                                "msg"     => 'Failed to Update User, Try Again !!'
                            ]);
                            return;
                        }
                    } else {
                        echo json_encode([
    
                            "msg"     => 'Failed to Update User, Try Again !!'
                        ]);
                        return;
                    }
                } else {
                    echo json_encode([

                        "msg"     => 'Failed to Update User, Try Again !!'
                    ]);
                    return;
                }
            } else {
                echo json_encode([

                    "msg"     => 'Failed to Update User, Try Again !!'
                ]);
                return;
            }       
        }

        public function delete($con, $id) {
            $query = "DELETE FROM public.v_users WHERE user_uuid = '$id'";
            $result = pg_query($con, $query);
            if ($result) {
                $queryUserGroup = "DELETE FROM public.v_user_groups WHERE user_uuid = '$id'";
                $resultUserGroup = pg_query($con, $queryUserGroup);
                if ($resultUserGroup) {
                    $queryUserSettings = "DELETE FROM public.v_user_settings WHERE user_uuid = '$id'";
                    $resultUserSettings = pg_query($con, $queryUserSettings);
                    if ($resultUserSettings) {
                        echo json_encode([
                            "message" => "User Deleted Successfully !!"
                        ]);            
                        return;
                    } else {
                        echo json_encode([
                            "message" => "Failed to Delete User, Try Again !!"
                        ]);            
                        return;
                    }
                } else {
                    echo json_encode([
                        "message" => "Failed to Delete User, Try Again !!"
                    ]);            
                    return;
                }
            } else {
                echo json_encode([
                    "message" => "Failed to Delete User, Try Again !!"
                ]);            
                return;
            }
        }

    }
?>
