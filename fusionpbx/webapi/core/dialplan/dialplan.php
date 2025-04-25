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

        public function fetch_namelist($con, $id) {
            $app_uuid = '4b821450-926b-175a-af93-a03c441818b1';

            $query = "SELECT dialplan_number as extension, dialplan_uuid as uuid, dialplan_name as name, 'transfer' as app, concat(dialplan_number, ' XML ', v_domains.domain_name) AS data 
            FROM public.v_dialplans 
            JOIN public.v_domains 
            ON v_domains.domain_uuid = v_dialplans.domain_uuid 
            WHERE v_dialplans.domain_uuid = '$id' AND app_uuid = '$app_uuid' 
            ORDER BY dialplan_number ASC";

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