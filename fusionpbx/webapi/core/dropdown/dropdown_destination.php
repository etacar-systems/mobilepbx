<?php
// Date :08-08-2024 Added for all feature drop-downlist

    require("../../config/config.php");

    class Dropdown {

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

        public function fetch($con,$id) {
            $response = array();

            $response['ivr_menus'] = $this->get_ivrs($con, $id);
            $response['ring_groups'] = $this->get_ring_groups($con, $id);
            $response['extensions'] = $this->extensions($con, $id);
	        $response['conference'] = $this->conference($con, $id);
			$response['recordings'] = $this->recordings($con, $id);
            $response['timeconditions'] = $this->timeconditions($con, $id);

            return $response;
        }

        public function get_ivrs($con, $id) {
            $query = "SELECT ivr_menu_extension as extension,ivr_menu_uuid as uuid,ivr_menu_name as name, 'transfer' as app, concat(ivr_menu_extension, ' XML ',v_domains.domain_name) AS data FROM public.v_ivr_menus 
            JOIN public.v_domains 
            ON v_domains.domain_uuid = v_ivr_menus.domain_uuid
            WHERE v_ivr_menus.domain_uuid = '$id'";
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


        public function get_ring_groups($con, $id) {
            $query = "SELECT ring_group_extension as extension,ring_group_uuid as uuid,ring_group_name as name, 'transfer' as app, concat(ring_group_extension, ' XML ',v_domains.domain_name) AS data FROM public.v_ring_groups
            JOIN public.v_domains 
            ON v_domains.domain_uuid = v_ring_groups.domain_uuid
            WHERE v_ring_groups.domain_uuid = '$id'";
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

        public function extensions($con, $id) {
            $query = "SELECT extension as extension,extension_uuid as uuid, extension as name, 'transfer' as app, concat(extension, ' XML ',v_domains.domain_name) AS data FROM public.v_extensions
            JOIN public.v_domains
            ON v_domains.domain_uuid = v_extensions.domain_uuid
            WHERE v_extensions.domain_uuid = '$id'";
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
     // Date :09-08-24 Added for conference list 
         public function conference($con, $id) {
            $query = "SELECT conference_center_extension as extension,conference_center_uuid as uuid,conference_center_name as name, 'transfer' as app, concat(conference_center_extension, ' XML ',v_domains.domain_name) AS data FROM public.v_conference_centers
            JOIN public.v_domains
            ON v_domains.domain_uuid = v_conference_centers.domain_uuid
            WHERE v_conference_centers.domain_uuid = '$id'";
            $result = pg_query($con, $query);
            if (pg_num_rows($result) > 0 ) {

                $arr = array();
                while ($row = pg_fetch_assoc($result)) {
                    $arr[] = $row;
                }

                return $arr;
            }else{
                return array();
		//return $query;
            }
        }
		// END 
		// Date :-08-08-2024 Added by Atul for get recording list.
		 public function recordings($con, $id) {
            $query = "SELECT recording_filename as recording_filename,recording_uuid  as uuid,recording_name as name, 'lua' as app, concat('streamfile.lua', recording_filename) AS data FROM public.v_recordings
            JOIN public.v_domains
            ON v_domains.domain_uuid = v_recordings.domain_uuid
            WHERE v_recordings.domain_uuid = '$id'";
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


        // Date :-08-08-2024 Added by Atul for get recording list.
         public function timeconditions($con, $id) {

            $app_uuid = '4b821450-926b-175a-af93-a03c441818b1';

             $query = "SELECT dialplan_number as extension,dialplan_uuid as uuid,dialplan_name as name, 'transfer' as app, concat(dialplan_number, ' XML ',v_domains.domain_name) AS data FROM public.v_dialplans
            JOIN public.v_domains
            ON v_domains.domain_uuid = v_dialplans.domain_uuid
            WHERE v_dialplans.domain_uuid = '$id' AND app_uuid = '$app_uuid' ";
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
