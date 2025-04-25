<?php
    require("../../config/config.php");
    require("../../vendor/autoload.php");
    require("../classes/SocketConnection.php");
    
    use Ramsey\Uuid\Uuid;

    class IVR {

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
            $query = 'SELECT * FROM public.v_ivr_menus
            JOIN public.v_domains
            ON v_domains.domain_uuid = v_ivr_menus.domain_uuid';
            $result = pg_query($con, $query);
            return $result;
        }

        public function fetch_ivr_by_id($con, $id) {
            $query = "SELECT * FROM public.v_ivr_menus
            JOIN public.v_domains
            ON v_domains.domain_uuid = v_ivr_menus.domain_uuid
            WHERE v_ivr_menus.ivr_menu_uuid = '$id'";
            $result = pg_query($con, $query);
            return $result;
        }

        public function fetch_ivr_menu_option_by_id($con, $id) {
            $query = "SELECT * FROM public.v_ivr_menu_options WHERE ivr_menu_uuid = '$id'";
            $result = pg_query($con, $query);
            return $result;
        }

        public function fetch_ivr_menu_option_by_option_id($con, $id) {
            $query = "SELECT * FROM public.v_ivr_menu_options WHERE ivr_menu_option_uuid = '$id'";
            $result = pg_query($con, $query);
            return $result;
        }

        public function fetch_ivr_by_domain($con, $id) {
            $query = "SELECT * FROM public.v_ivr_menus
            JOIN public.v_domains
            ON v_domains.domain_uuid = v_ivr_menus.domain_uuid
            WHERE v_ivr_menus.domain_uuid = '$id'";
            $result = pg_query($con, $query);
            return $result;
        }

        
        public function post($con, $uuidIVR, $data, $userID) {

            $name = $data->name;
            $extension = $data->extension;
            		
            $context = $data->context;
            $greet_long_file= $data->greet_long;
	    //$greet_long="/var/lib/freeswitch/recordings/$context/$greet_long_file";	
            $greet_long=$greet_long_file;
	    $greet_short_short = $data->greet_short;
	    
	    //$greet_short="/var/lib/freeswitch/recordings/$context/$greet_short_file";	
            $greet_short=$greet_short_file;
	    $domain = $data->domain_id;
            $description = $data->description;
            $ivr_enabled = $data->ivr_enabled;
            $ivr_menu_timeout = $data->ivr_menu_timeout;
            $ivr_menu_exit_app = $data->ivr_menu_exit_app;
            $ivr_menu_exit_data = $data->ivr_menu_exit_data;
            $ivr_menu_direct_dial = $data->ivr_menu_direct_dial;
            $ivr_menu_ringback = (empty($data->ivr_menu_ringback)) ? "local_stream://default" : $data->ivr_menu_ringback;
            $ivr_menu_cid_prefix = $data->ivr_menu_cid_prefix;
            $ivr_menu_invalid_sound = (empty($data->ivr_menu_invalid_sound)) ? 'ivr/ivr-that_was_an_invalid_entry.wav' : $data->ivr_menu_invalid_sound; 
            $ivr_menu_exit_sound = $data->ivr_menu_exit_sound;
            $ivr_menu_pin_number = $data->ivr_menu_pin_number;
            $ivr_menu_confirm_macro = $data->ivr_menu_confirm_macro;
            $ivr_menu_confirm_key = $data->ivr_menu_confirm_key;
            $ivr_menu_tts_engine = (empty($data->ivr_menu_tts_engine)) ? 'flite' : $data->ivr_menu_tts_engine;
            $ivr_menu_tts_voice = (empty($data->ivr_menu_tts_voice)) ? 'rms' : $data->ivr_menu_tts_voice;
            $ivr_menu_confirm_attempts = (empty($data->ivr_menu_confirm_attempts)) ? '1' : $data->ivr_menu_confirm_attempts;
            $ivr_menu_inter_digit_timeout = (empty($data->ivr_menu_inter_digit_timeout)) ? '2000' : $data->ivr_menu_inter_digit_timeout;
            $ivr_menu_max_failures = (empty($data->ivr_menu_max_failures)) ? '1' : $data->ivr_menu_max_failures;
            $ivr_menu_max_timeouts = (empty($data->ivr_menu_max_timeouts)) ? '1' : $data->ivr_menu_max_timeouts;
            $ivr_menu_digit_len = (empty($data->ivr_menu_digit_len)) ? '5' : $data->ivr_menu_digit_len;
            $ivr_menu_parent_id = $data->ivr_menu_parent_id;

            $ivr_menu_option = $data->ivr_menu_option;

            if (empty(trim($extension))) {
                echo json_encode([
                    "msg"     => 'Extension cannot be EMPTY !'
                ]);
                return;
            } elseif (empty(trim($name))) {
                echo json_encode([
                    "msg"     => 'Name Cannot be EMPTY !'
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
            } 

            $insert_key = 'ivr_menu_uuid, domain_uuid, ivr_menu_name, ivr_menu_extension, ivr_menu_dialect, ivr_menu_voice, ivr_menu_greet_long, ivr_menu_greet_short, ivr_menu_invalid_sound, ivr_menu_tts_engine, ivr_menu_tts_voice, ivr_menu_confirm_attempts, ivr_menu_timeout, ivr_menu_inter_digit_timeout, ivr_menu_max_failures, ivr_menu_max_timeouts, ivr_menu_digit_len, ivr_menu_direct_dial, ivr_menu_ringback, ivr_menu_context, ivr_menu_enabled, ivr_menu_description, insert_user, ivr_menu_exit_app, ivr_menu_exit_data, ivr_menu_cid_prefix, ivr_menu_exit_sound ';

            $insert_values = "'$uuidIVR', '$domain', '$name', '$extension', 'us', 'callie', '$greet_long', '$greet_short', '$ivr_menu_invalid_sound', '$ivr_menu_tts_engine', '$ivr_menu_tts_voice', '$ivr_menu_confirm_attempts', $ivr_menu_timeout, $ivr_menu_inter_digit_timeout, $ivr_menu_max_failures, $ivr_menu_max_timeouts, $ivr_menu_digit_len, '$ivr_menu_direct_dial', '$ivr_menu_ringback', '$context', '$ivr_enabled', '$description', '$userID', '$ivr_menu_exit_app', '$ivr_menu_exit_data', '$ivr_menu_cid_prefix', '$ivr_menu_exit_sound' ";

            if(!empty($ivr_menu_parent_id) && $ivr_menu_parent_id != 'null'){

                $insert_key .= ', ivr_menu_parent_uuid';
                $insert_values .= ", '$ivr_menu_parent_id'";
            }

            if(!empty($ivr_menu_pin_number) && $ivr_menu_pin_number != 'NULL'){

                $insert_key .= ', ivr_menu_pin_number';
                $insert_values .= ", '$ivr_menu_pin_number'";
            }

            if(!empty($ivr_menu_confirm_macro) && $ivr_menu_confirm_macro != 'NULL'){

                $insert_key .= ', ivr_menu_confirm_macro';
                $insert_values .= ", '$ivr_menu_confirm_macro'";
            }


            if(!empty($ivr_menu_confirm_key) && $ivr_menu_confirm_key != 'NULL'){

                $insert_key .= ', ivr_menu_confirm_key';
                $insert_values .= ", '$ivr_menu_confirm_key'";
            }

            // $userID = '3d7c90a5-3936-422a-8fac-4dbfbea35237';
            // $insertIVR = "INSERT INTO public.v_ivr_menus (ivr_menu_uuid, domain_uuid, ivr_menu_name, ivr_menu_extension, ivr_menu_dialect, ivr_menu_voice, ivr_menu_greet_long, ivr_menu_greet_short, ivr_menu_invalid_sound, ivr_menu_tts_engine, ivr_menu_tts_voice, ivr_menu_confirm_attempts, ivr_menu_timeout, ivr_menu_inter_digit_timeout, ivr_menu_max_failures, ivr_menu_max_timeouts, ivr_menu_digit_len, ivr_menu_direct_dial, ivr_menu_ringback, ivr_menu_context, ivr_menu_enabled, ivr_menu_description, insert_user) VALUES ('$uuidIVR', '$domain', '$name', '$extension', 'us', 'callie', '$greet_long', '$greet_short', 'ivr/ivr-that_was_an_invalid_entry.wav', 'flite', 'rms', 1, 3000, 2000, 1, 1, 5, 'false', 'local_stream://default', '$context', '$ivr_enabled', '$description', '$userID')";


            $insertIVR = "INSERT INTO public.v_ivr_menus ($insert_key) VALUES ($insert_values)";

            $resultIVR = pg_query($con, $insertIVR);
            if ($resultIVR) {

                $dialplan_ivr_id = $this->create_dialplan_ivr($con, $domain, $context, $uuidIVR, $name, $userID,$data);
                $updateIVRDialplan = "UPDATE public.v_ivr_menus SET 
                dialplan_uuid = '$dialplan_ivr_id'
                WHERE ivr_menu_uuid = '$uuidIVR'";
                pg_query($con, $updateIVRDialplan);


                // start : 04/08/2024 : Atul
                $option_array = array();
                if(!empty($ivr_menu_option)){
                    foreach ($ivr_menu_option as $k) {

                        $uuid = Uuid::uuid4();                        
                        // Get the UUID as a string
                        $ivr_manu_option_uuid = $uuid->toString();
                        $ivr_menu_id = $uuidIVR;
                        $menu_digit = $k->menu_digit;
                        $menu_option = $k->menu_option;
                        $menu_param = $k->menu_param;
                        $menu_order = $k->menu_order;
                        $ivr_menu_option_enabled = $k->ivr_menu_option_enabled;

                        array_push($option_array, array('menu_digit'=>$menu_digit,'ivr_manu_option_uuid'=>$ivr_manu_option_uuid));

                        $this->postMenuOption($con, $ivr_manu_option_uuid, $ivr_menu_id, $domain, $menu_digit, $menu_option, $menu_param, $menu_order, $ivr_menu_option_enabled, $userID);
                    }
                }
                // end : 04/08/2024 : Atul

                SocketConnection::cache_delete("dialplan:".$context);
                SocketConnection::cache_delete("configuration:ivr.conf:".$ivr_menu_id);

                if(isset($ivr_menu_parent_id) && strlen($ivr_menu_parent_id) > 0){

                    if($ivr_menu_parent_id != 'null'){
                        $sql = "with recursive ivr_menus as ( ";
                        $sql .="    select ivr_menu_parent_uuid ";
                        $sql .="     from v_ivr_menus ";
                        $sql .="     where ivr_menu_parent_uuid = '$ivr_menu_parent_id' ";
                        $sql .="     and ivr_menu_enabled = 'true' ";
                        $sql .="     union all ";
                        $sql .="     select parent.ivr_menu_parent_uuid ";
                        $sql .="     from v_ivr_menus as parent, ivr_menus as child ";
                        $sql .="     where parent.ivr_menu_uuid = child.ivr_menu_parent_uuid ";
                        $sql .="     and parent.ivr_menu_enabled = 'true' ";
                        $sql .="    ) ";
                        $sql .="    select * from ivr_menus ";

                        $result = pg_query($con, $sql);

                        if (pg_num_rows($result) > 0 ) {

                            while ($row = pg_fetch_assoc($result)) {
                                SocketConnection::cache_delete("configuration:ivr.conf:".$row['ivr_menu_parent_uuid']);
                            }
                        }
                    }
                    

                }
                
                

                echo json_encode([
                    "msg"     => 'IVR Created Successfully !!',
                    "id"      => $uuidIVR,
                    "ivr_menu_option"      => $option_array
                ]);
                return;
            } else {
                echo json_encode([

                    "msg"     => 'Failed to Create IVR, Try Again !!'
                ]);
                return;
            }       
        }

        public function postMenuOption($con, $uuidMenuOptionIVR, $ivr_menu_id, $domain, $menu_digit, $menu_option, $menu_param, $menu_order, $ivr_menu_enabled, $userID) {
            if (empty(trim($menu_digit))) {
                echo json_encode([
                    "msg"     => 'Please Select Option !'
                ]);
                return;
            } 
		// elseif (empty(trim($menu_option))) {
               // echo json_encode([
              //      "msg"     => 'Please Select Destination !'
             //   ]);
            //    return;
           // } 
		 elseif (empty(($domain))) {
                echo json_encode([
                    "msg"     => 'Please Select Domain !'
                ]);
                return;
            } elseif (empty(($ivr_menu_id))) {
                echo json_encode([
                    "msg"     => 'Please Select IVR !'
                ]);
                return;
            }

            // $userID = '3d7c90a5-3936-422a-8fac-4dbfbea35237';
            $insertIVR = "INSERT INTO public.v_ivr_menu_options (ivr_menu_option_uuid, ivr_menu_uuid, domain_uuid, ivr_menu_option_digits, ivr_menu_option_action, ivr_menu_option_param, ivr_menu_option_order, ivr_menu_option_enabled, insert_user) VALUES ('$uuidMenuOptionIVR', '$ivr_menu_id', '$domain', '$menu_digit', '$menu_option', '$menu_param', '$menu_order', '$ivr_menu_enabled', '$userID')";
            $resultIVR = pg_query($con, $insertIVR);
            if ($resultIVR) {
                // echo json_encode([
                //     "msg"     => 'IVR Menu Option Created Successfully !!',
                //     "id"      => $uuidMenuOptionIVR
                // ]);
                return;
            } else {
                echo json_encode([

                    "msg"     => 'Failed to Create IVR Menu Option, Try Again !!'
                ]);
                return;
            }       
        }

        public function update($con, $data, $userID) {

            $ivr_id = $data->ivr_id;
            $name = $data->name;
            $extension = $data->extension;
            $greet_long = $data->greet_long;
            $greet_short = $data->greet_short;
            $domain = $data->domain_id;
            $context = $data->context;
            $description = $data->description;
            $ivr_enabled = $data->ivr_enabled;
            $ivr_menu_timeout = $data->ivr_menu_timeout;
            $ivr_menu_exit_app = $data->ivr_menu_exit_app;
            $ivr_menu_exit_data = $data->ivr_menu_exit_data;
            $ivr_menu_direct_dial = $data->ivr_menu_direct_dial;
            $ivr_menu_ringback = (empty($data->ivr_menu_ringback)) ? "local_stream://default" : $data->ivr_menu_ringback;
            $ivr_menu_cid_prefix = $data->ivr_menu_cid_prefix;
            $ivr_menu_invalid_sound = (empty($data->ivr_menu_invalid_sound)) ? 'ivr/ivr-that_was_an_invalid_entry.wav' : $data->ivr_menu_invalid_sound; 
            $ivr_menu_exit_sound = $data->ivr_menu_exit_sound;
            $ivr_menu_pin_number = $data->ivr_menu_pin_number;
            $ivr_menu_confirm_macro = $data->ivr_menu_confirm_macro;
            $ivr_menu_confirm_key = $data->ivr_menu_confirm_key;
            $ivr_menu_tts_engine = (empty($data->ivr_menu_tts_engine)) ? 'flite' : $data->ivr_menu_tts_engine;
            $ivr_menu_tts_voice = (empty($data->ivr_menu_tts_voice)) ? 'rms' : $data->ivr_menu_tts_voice;
            $ivr_menu_confirm_attempts = (empty($data->ivr_menu_confirm_attempts)) ? '1' : $data->ivr_menu_confirm_attempts;
            $ivr_menu_inter_digit_timeout = (empty($data->ivr_menu_inter_digit_timeout)) ? '2000' : $data->ivr_menu_inter_digit_timeout;
            $ivr_menu_max_failures = (empty($data->ivr_menu_max_failures)) ? '1' : $data->ivr_menu_max_failures;
            $ivr_menu_max_timeouts = (empty($data->ivr_menu_max_timeouts)) ? '1' : $data->ivr_menu_max_timeouts;
            $ivr_menu_digit_len = (empty($data->ivr_menu_digit_len)) ? '5' : $data->ivr_menu_digit_len;
            $ivr_menu_parent_id = $data->ivr_menu_parent_id;

            $ivr_menu_option = $data->ivr_menu_option;

            if (empty(trim($extension))) {
                echo json_encode([
                    "msg"     => 'Extension cannot be EMPTY !'
                ]);
                return;
            } elseif (empty(trim($name))) {
                echo json_encode([
                    "msg"     => 'Name Cannot be EMPTY !'
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
            } elseif (empty(($description))) {
                echo json_encode([
                    "msg"     => 'Description cannot be EMPTY !'
                ]);
                return;
            } 

            $editIVR = "UPDATE public.v_ivr_menus SET 
            domain_uuid = '$domain',
            ivr_menu_name = '$name',
            ivr_menu_extension = '$extension',
            ivr_menu_greet_long = '$greet_long',
            ivr_menu_greet_short = '$greet_short',
            ivr_menu_exit_app = '$ivr_menu_exit_app',
            ivr_menu_exit_data = '$ivr_menu_exit_data',
            ivr_menu_context = '$context', 
            ivr_menu_enabled = '$ivr_enabled', 
            ivr_menu_description = '$description',
            ivr_menu_timeout = '$ivr_menu_timeout',
            ivr_menu_direct_dial = '$ivr_menu_direct_dial',
            ivr_menu_ringback = '$ivr_menu_ringback',
            ivr_menu_cid_prefix = '$ivr_menu_cid_prefix',
            ivr_menu_invalid_sound = '$ivr_menu_invalid_sound',
            ivr_menu_exit_sound = '$ivr_menu_exit_sound' ";

            if(!empty($ivr_menu_parent_id) && $ivr_menu_parent_id != 'null'){

                $editIVR .= ", ivr_menu_parent_uuid = '$ivr_menu_parent_id'";
            }
            
            if(!empty($ivr_menu_pin_number) && $ivr_menu_pin_number != 'NULL'){

                $editIVR .= ", ivr_menu_pin_number = '$ivr_menu_pin_number'";
            }

            if(!empty($ivr_menu_confirm_macro) && $ivr_menu_confirm_macro != 'NULL'){

                $editIVR.= ", ivr_menu_confirm_macro = '$ivr_menu_confirm_macro'";
            }


            if(!empty($ivr_menu_confirm_key) && $ivr_menu_confirm_key != 'NULL'){

                $editIVR .= ", ivr_menu_confirm_key = '$ivr_menu_confirm_key'";
            }

            $editIVR .= ", ivr_menu_tts_engine = '$ivr_menu_tts_engine', 
            ivr_menu_tts_voice = '$ivr_menu_tts_voice',
            ivr_menu_confirm_attempts = '$ivr_menu_confirm_attempts',
            ivr_menu_inter_digit_timeout = '$ivr_menu_inter_digit_timeout',
            ivr_menu_max_failures = '$ivr_menu_max_failures',
            ivr_menu_max_timeouts = '$ivr_menu_max_timeouts',
            ivr_menu_digit_len = '$ivr_menu_digit_len' ";


            $editIVR .= " WHERE ivr_menu_uuid = '$ivr_id'";
            $resultIVR = pg_query($con, $editIVR);
            if ($resultIVR) {

                $checkDialplan = "SELECT * FROM public.v_ivr_menus WHERE ivr_menu_uuid = '$ivr_id'";
                $resultCheckDialplan = pg_query($con, $checkDialplan);
                if (pg_num_rows($resultCheckDialplan) > 0) {
                    $row = pg_fetch_assoc($resultCheckDialplan); 
                    $dialplan_id = $row['dialplan_uuid'];
                    $queryDeleteDialplan = "DELETE FROM public.v_dialplans WHERE dialplan_uuid = '$dialplan_id'";
                    pg_query($con, $queryDeleteDialplan);
                }

                $dialplan_ivr_id = $this->create_dialplan_ivr($con, $domain, $context, $ivr_id, $name, $userID,$data);
                $updateIVRDialplan = "UPDATE public.v_ivr_menus SET 
                dialplan_uuid = '$dialplan_ivr_id'
                WHERE ivr_menu_uuid = '$ivr_id'";
                pg_query($con, $updateIVRDialplan);

                $queryMenuOption = "DELETE FROM public.v_ivr_menu_options WHERE ivr_menu_uuid = '$ivr_id'";
                $resultMenuOption = pg_query($con, $queryMenuOption);

                // start : 04/08/2024 : Atul
                $option_array = array();
                if(!empty($ivr_menu_option)){
                    foreach ($ivr_menu_option as $k) {

                                           
                        // Get the UUID as a string
                        $menu_digit = $k->menu_digit;
                        $menu_option = $k->menu_option;
                        $menu_param = $k->menu_param;
                        $menu_order = $k->menu_order;
                        $ivr_menu_option_enabled = $k->ivr_menu_option_enabled;

                        $uuid = Uuid::uuid4();
                        $ivr_manu_option_uuid = $uuid->toString();                        
                        
                        array_push($option_array, array('menu_digit'=>$menu_digit,'ivr_manu_option_uuid'=>$ivr_manu_option_uuid));

                        $this->postMenuOption($con, $ivr_manu_option_uuid, $ivr_id, $domain, $menu_digit, $menu_option, $menu_param, $menu_order, $ivr_menu_option_enabled, $userID);

                        //$this->updateMenuOption($con, $ivr_manu_option_uuid, $domain, $menu_digit, $menu_option, $menu_param, $menu_order, $ivr_menu_option_enabled);
                    }
                }
                // end : 04/08/2024 : Atul


                SocketConnection::cache_delete("dialplan:".$context);
                SocketConnection::cache_delete("configuration:ivr.conf:".$ivr_id);

                if(isset($ivr_menu_parent_id) && strlen($ivr_menu_parent_id) > 0){

                    if($ivr_menu_parent_id != 'null'){
                        $sql = "with recursive ivr_menus as ( ";
                        $sql .="    select ivr_menu_parent_uuid ";
                        $sql .="     from v_ivr_menus ";
                        $sql .="     where ivr_menu_parent_uuid = '$ivr_menu_parent_id' ";
                        $sql .="     and ivr_menu_enabled = 'true' ";
                        $sql .="     union all ";
                        $sql .="     select parent.ivr_menu_parent_uuid ";
                        $sql .="     from v_ivr_menus as parent, ivr_menus as child ";
                        $sql .="     where parent.ivr_menu_uuid = child.ivr_menu_parent_uuid ";
                        $sql .="     and parent.ivr_menu_enabled = 'true' ";
                        $sql .="    ) ";
                        $sql .="    select * from ivr_menus ";

                        $result = pg_query($con, $sql);

                        if (pg_num_rows($result) > 0 ) {

                            while ($row = pg_fetch_assoc($result)) {
                                SocketConnection::cache_delete("configuration:ivr.conf:".$row['ivr_menu_parent_uuid']);
                            }
                        }
                    }
                    

                }

                echo json_encode([
                    "msg"     => 'IVR Updated Successfully !!',
                    "ivr_menu_option"      => $option_array
                ]);
                return;
            } else {
                echo json_encode([

                    "msg"     => 'Failed to Update IVR, Try Again !!'
                ]);
                return;
            }       
        }

        /*
        public function update($con, $ivr_id, $name, $extension, $greet_long, $greet_short, $domain, $context, $description, $ivr_enabled) {
            if (empty(trim($extension))) {
                echo json_encode([
                    "msg"     => 'Extension cannot be EMPTY !'
                ]);
                return;
            } elseif (empty(trim($name))) {
                echo json_encode([
                    "msg"     => 'Name Cannot be EMPTY !'
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
            } elseif (empty(($description))) {
                echo json_encode([
                    "msg"     => 'Description cannot be EMPTY !'
                ]);
                return;
            } 

            $editIVR = "UPDATE public.v_ivr_menus SET 
            domain_uuid = '$domain',
            ivr_menu_name = '$name',
            ivr_menu_extension = '$extension',
            ivr_menu_greet_long = '$greet_long',
            ivr_menu_greet_short = '$greet_short',
            ivr_menu_context = '$context', 
            ivr_menu_enabled = '$ivr_enabled', 
            ivr_menu_description = '$description'
            WHERE ivr_menu_uuid = '$ivr_id'";
            $resultIVR = pg_query($con, $editIVR);
            if ($resultIVR) {
                echo json_encode([
                    "msg"     => 'IVR Updated Successfully !!'
                ]);
                return;
            } else {
                echo json_encode([

                    "msg"     => 'Failed to Update IVR, Try Again !!'
                ]);
                return;
            }       
        }
        */


        public function updateMenuOption($con, $ivr_menu_id, $domain, $menu_digit, $menu_option, $menu_param, $menu_order, $ivr_menu_enabled) {
            if (empty(trim($menu_digit))) {
                echo json_encode([
                    "msg"     => 'Please Select Option !'
                ]);
                return;
            } elseif (empty(trim($menu_option))) {
                echo json_encode([
                    "msg"     => 'Please Select Destination !'
                ]);
                return;
            } elseif (empty(($domain))) {
                echo json_encode([
                    "msg"     => 'Please Select Domain !'
                ]);
                return;
            }

            $editIVR = "UPDATE public.v_ivr_menu_options SET
            domain_uuid = '$domain',
            ivr_menu_option_digits = '$menu_digit',
            ivr_menu_option_action = '$menu_option',
            ivr_menu_option_param = '$menu_param',
            ivr_menu_option_order = '$menu_order',
            ivr_menu_option_enabled = '$ivr_menu_enabled'
            WHERE ivr_menu_option_uuid = '$ivr_menu_id'";
            $resultIVR = pg_query($con, $editIVR);
            if ($resultIVR) {
                // echo json_encode([
                //     "msg"     => 'IVR Menu Option Updated Successfully !!'
                // ]);
                return;
            } else {
                echo json_encode([

                    "msg"     => 'Failed to Update IVR Menu Option, Try Again !!'
                ]);
                return;
            }       
        }

        public function delete($con, $id) {
            $checkDialplan = "SELECT * FROM public.v_ivr_menus WHERE ivr_menu_uuid = '$id'";
            $resultCheckDialplan = pg_query($con, $checkDialplan);
            if (pg_num_rows($resultCheckDialplan) > 0) {
                $row = pg_fetch_assoc($resultCheckDialplan); 
                $dialplan_id = $row['dialplan_uuid'];
                $queryDeleteDialplan = "DELETE FROM public.v_dialplans WHERE dialplan_uuid = '$dialplan_id'";
                pg_query($con, $queryDeleteDialplan);
                $queryDeleteDialplanDetails = "DELETE FROM public.v_dialplan_details WHERE dialplan_uuid = '$dialplan_id'";
                pg_query($con, $queryDeleteDialplanDetails);
            }

            $query = "DELETE FROM public.v_ivr_menus WHERE ivr_menu_uuid = '$id'";
            $result = pg_query($con, $query);
            if ($result) {
                $queryMenuOption = "DELETE FROM public.v_ivr_menu_options WHERE ivr_menu_uuid = '$id'";
                $resultMenuOption = pg_query($con, $queryMenuOption);
                if ($resultMenuOption) {
                    echo json_encode([
                        "message" => "IVR Deleted Successfully !!"
                    ]);            
                    return;
                } else {
                    echo json_encode([
                        "message" => "Failed to Delete IVR, Try Again !!"
                    ]);            
                    return;
                }
            } else {
                echo json_encode([
                    "message" => "Failed to Delete IVR, Try Again !!"
                ]);            
                return;
            }
        }

        public function delete_ivr_menu($con, $id) {
            $query = "DELETE FROM public.v_ivr_menu_options WHERE ivr_menu_option_uuid = '$id'";
            $result = pg_query($con, $query);
            if ($result) {
                echo json_encode([
                    "message" => "IVR Menu Option Deleted Successfully !!"
                ]);            
                return;
            } else {
                echo json_encode([
                    "message" => "Failed to Delete IVR Menu Option, Try Again !!"
                ]);            
                return;
            }
        }

        public function create_dialplan_ivr($con, $domain_id, $context, $ivr_uuid, $ivr_name, $userID,$data) {
            $dialplan_id = Uuid::uuid4()->toString();
            $app_uuid = 'a5788e9b-58bc-bd1b-df59-fff5d51253ab';

            
            $extension = $data->extension;
            $ivr_menu_exit_app = $data->ivr_menu_exit_app;
            $ivr_menu_exit_data = $data->ivr_menu_exit_data;
        
            $ivr_menu_ringback = (empty($data->ivr_menu_ringback)) ? "local_stream://default" : $data->ivr_menu_ringback;
            $ivr_menu_cid_prefix = $data->ivr_menu_cid_prefix;            


            $dialplan_xml = "<extension name=\"".$ivr_name."\" continue=\"false\" uuid=\"".$dialplan_id."\">\n";
            $dialplan_xml .= "  <condition field=\"destination_number\" expression=\"^".$extension."\$\">\n";
            $dialplan_xml .= "      <action application=\"ring_ready\" data=\"\"/>\n";
            
            $dialplan_xml .= "      <action application=\"answer\" data=\"\"/>\n";
            
            $dialplan_xml .= "      <action application=\"sleep\" data=\"1000\"/>\n";
            $dialplan_xml .= "      <action application=\"set\" data=\"hangup_after_bridge=true\"/>\n";
            if (!empty($ivr_menu_ringback)) {
                $dialplan_xml .= "      <action application=\"set\" data=\"ringback=".$ivr_menu_ringback."\"/>\n";
            }
            if (!empty($ivr_menu_ringback)) {
                $dialplan_xml .= "      <action application=\"set\" data=\"transfer_ringback=".$ivr_menu_ringback."\"/>\n";
            }
            $dialplan_xml .= "      <action application=\"set\" data=\"ivr_menu_uuid=".$ivr_uuid."\"/>\n";

            
            if (!empty($ivr_menu_cid_prefix)) {
                $dialplan_xml .= "      <action application=\"set\" data=\"caller_id_name=".$ivr_menu_cid_prefix."#\${caller_id_name}\"/>\n";
                $dialplan_xml .= "      <action application=\"set\" data=\"effective_caller_id_name=\${caller_id_name}\"/>\n";
            }
            $dialplan_xml .= "      <action application=\"ivr\" data=\"".$ivr_uuid."\"/>\n";
            

            if (!empty($ivr_menu_exit_app)) {
                $dialplan_xml .= "      <action application=\"".$ivr_menu_exit_app."\" data=\"".$ivr_menu_exit_data."\"/>\n";
            }
            $dialplan_xml .= "  </condition>\n";
            $dialplan_xml .= "</extension>\n";

           
            $insertQuery = "INSERT INTO public.v_dialplans (dialplan_uuid, app_uuid, domain_uuid, dialplan_context, dialplan_name, dialplan_number, dialplan_continue, dialplan_order, dialplan_xml, dialplan_enabled, dialplan_description, insert_user) VALUES ('$dialplan_id', '$app_uuid', '$domain_id', '$context', '$ivr_name', '$extension', 'true', '102', '$dialplan_xml', 'true', '$ivr_name', '$userID')";
            pg_query($con, $insertQuery);
            return $dialplan_id;
        }


        public function cache_delete($key){

            
            $method = 'file';
        
            $syslog = 'false';
        
            $location = '/var/cache/fusionpbx';
            

            //change the delimiter
            $key = str_replace(":", ".", $key);

            $fp = SocketConnection::_event_socket_create();

            $event = "sendevent CUSTOM\n";
            $event .= "Event-Name: CUSTOM\n";
            $event .= "Event-Subclass: fusion::file\n";
            $event .= "API-Command: cache\n";
            $event .= "API-Command-Argument: delete ".$key."\n";

            $json = SocketConnection::_event_socket_request($fp, $event);

        //remove the local files
            foreach (glob($location . "/" . $key) as $file) {
                if (file_exists($file)) {
                    unlink($file);
                }
                if (file_exists($file)) {
                    unlink($file . ".tmp");
                }
            }
        }

        public function fetch_namelist($con, $id) {
            $query = "SELECT ivr_menu_extension as extension,ivr_menu_uuid as uuid,ivr_menu_name as name, 'transfer' as app, concat(ivr_menu_extension, ' XML ',v_domains.domain_name) AS data 
            FROM public.v_ivr_menus 
            JOIN public.v_domains 
            ON v_domains.domain_uuid = v_ivr_menus.domain_uuid
            WHERE v_ivr_menus.domain_uuid = '$id' 
            ORDER BY ivr_menu_extension ASC";
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
