<?php
    require("../../config/config.php");

    class Zoiper {

        public function verify_user($con, $username, $password) {
            $query = "SELECT * FROM public.v_users WHERE username = '$username'";
            $result = pg_query($con,$query);
            $admin = pg_fetch_array($result);
        
            if (!empty($admin)) {
                if (password_verify($password, $admin['password'])) {
                    return 'true';
                } else {
                    return 'false';   
                }
                
            } else {
                return 'false';
            }
        }

        public function fetch_by_domain($con, $id) {
            $query = "SELECT extension, password, description, domain_name FROM public.v_extensions
            JOIN public.v_domains
            ON v_domains.domain_uuid = v_extensions.domain_uuid
            WHERE v_extensions.domain_uuid = '$id'";
            $result = pg_query($con, $query);
            return $result;
        }

    }
?>