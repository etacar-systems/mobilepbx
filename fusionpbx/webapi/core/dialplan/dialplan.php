<?php
    require("../../config/config.php");

    class Dialplan {

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
        
        public function fetch($con) {
            $query = 'SELECT * FROM public.v_dialplans';
            $result = pg_query($con, $query);
            return $result;
        }

        public function fetch_by_id($con, $id) {
            $query = "SELECT * FROM public.v_dialplans WHERE dialplan_uuid ='$id'";
            $result = pg_query($con, $query);
            return $result;
        }

        public function fetch_by_domain($con, $id) {
            $query = "SELECT * FROM public.v_dialplans WHERE domain_uuid ='$id'";
            $result = pg_query($con, $query);
            return $result;
        }

    }
?>