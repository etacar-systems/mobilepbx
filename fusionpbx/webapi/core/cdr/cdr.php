<?php
    require("../../config/config.php");

    class Cdr {

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
        $query = "SELECT xml_cdr_uuid,domain_uuid,domain_name,sip_call_id,extension_uuid,direction,caller_id_name,caller_id_number,destination_number,start_stamp,duration,record_name,status,hangup_cause,SUBSTRING(record_path, POSITION('archive/' IN record_path) + 8) || '/' || record_name as record_url FROM public.v_xml_cdr";    
	$result = pg_query($con, $query);
            return $result;
        }

	// Date :08-08-2024 Added by Atul for get cdr by extension uuid
	 public function fetch_by_extension_uuid($con,$id) {
            $query = "SELECT xml_cdr_uuid,domain_uuid,domain_name,sip_call_id,extension_uuid,direction,caller_id_name,caller_id_number,destination_number,start_stamp,duration,record_name,status,hangup_cause,SUBSTRING(record_path, POSITION('archive/' IN record_path) + 8) || '/' || record_name as record_url FROM public.v_xml_cdr where extension_uuid='$id'";
            $result = pg_query($con, $query);
            return $result;
        }

 	// END 

        public function fetch_by_domain($con, $id,$per_page,$page,$start_date,$end_date,$extension,$direction,$destination,$caller_name,$caller_number) {

            $start    = ($page - 1) * $per_page;

            $query = "SELECT xml_cdr_uuid,domain_name,domain_uuid,sip_call_id,extension_uuid,direction,caller_id_name,caller_id_number,destination_number,start_stamp,duration,record_name,status,hangup_cause,SUBSTRING(record_path, POSITION('archive/' IN record_path) + 8) || '/' || record_name as record_url FROM public.v_xml_cdr WHERE domain_uuid ='$id' ";

            $count_query = "SELECT count(*) as total FROM public.v_xml_cdr WHERE domain_uuid ='$id' ";


            if(strlen($start_date) > 0 && strlen($end_date) > 0){
                $query .= " AND insert_date::date BETWEEN '$start_date' AND '$end_date' ";
                $count_query .= " AND insert_date::date BETWEEN '$start_date' AND '$end_date' ";
            }

            if(strlen($extension) > 0){
                $query .= " AND extension_uuid = '$extension' ";
                $count_query .= " AND extension_uuid = '$extension' ";
            }

            if(strlen($direction) > 0){
                $query .= " AND direction = '$direction' ";
                $count_query .= " AND direction = '$direction' ";
            }

            if(strlen($destination) > 0){
                $query .= " AND destination_number LIKE '%".$destination."%' ";
                $count_query .= " AND destination_number LIKE '%".$destination."%' ";
            }

            if(strlen($caller_name) > 0){
                $query .= " AND caller_id_name LIKE '%".$caller_name."%' ";
                $count_query .= " AND caller_id_name LIKE '%".$caller_name."%' ";
            }

            if(strlen($caller_number) > 0){
                $query .= " AND caller_id_number LIKE '%".$caller_number."%' ";
                $count_query .= " AND caller_id_number LIKE '%".$caller_number."%' ";
            }

            $query .= " ORDER BY start_stamp desc LIMIT $per_page OFFSET $start";
            $result = pg_query($con, $query);

            $count_result = pg_query($con, $count_query);

            $total_rows = 0;
            if (pg_num_rows($count_result) > 0 ) {
                while ($count_row = pg_fetch_assoc($count_result)) {
                    
                    $total_rows = $count_row['total'];
                }
            }


            return array('records'=>$result,'total_rows'=>$total_rows);
        }

        public function fetch_by_domain_date($con, $id, $start_date, $end_date) {
            $query = "SELECT xml_cdr_uuid,domain_name,domain_uuid,sip_call_id,extension_uuid,direction,caller_id_name,caller_id_number,destination_number,start_stamp,duration,record_name,status,hangup_cause,SUBSTRING(record_path, POSITION('archive/' IN record_path) + 8) || '/' || record_name as record_url FROM public.v_xml_cdr WHERE domain_uuid ='$id' AND insert_date::date BETWEEN '$start_date' AND '$end_date'";
            $result = pg_query($con, $query);
            return $result;
        }


        public function fetch_by_recordings($con, $id,$per_page,$page,$start_date,$end_date,$extension,$direction,$destination,$caller_name,$caller_number,$module) {

            $start    = ($page - 1) * $per_page;

            $query = "SELECT xml_cdr_uuid,domain_name,direction,caller_id_name,caller_id_number,destination_number,start_stamp,duration,record_name,status,hangup_cause,SUBSTRING(record_path, POSITION('archive/' IN record_path) + 8) || '/' || record_name as record_url FROM public.v_xml_cdr WHERE domain_uuid ='$id' and record_name IS NOT NULL ";

            $count_query = "SELECT count(*) as total FROM public.v_xml_cdr WHERE domain_uuid ='$id' and record_name IS NOT NULL ";

            if(strlen($start_date) > 0 && strlen($end_date) > 0){
                $query .= " AND insert_date::date BETWEEN '$start_date' AND '$end_date' ";
                $count_query .= " AND insert_date::date BETWEEN '$start_date' AND '$end_date' ";
            }

            if(strlen($extension) > 0){
                $query .= " AND extension_uuid = '$extension' ";
                $count_query .= " AND extension_uuid = '$extension' ";
            }

            if(strlen($direction) > 0){
                $query .= " AND direction = '$direction' ";
                $count_query .= " AND direction = '$direction' ";
            }

            if(strlen($destination) > 0){
                $query .= " AND destination_number LIKE '%".$destination."%' ";
                $count_query .= " AND destination_number = '%".$destination."%' ";
            }

            if(strlen($caller_name) > 0){
                $query .= " AND caller_id_name LIKE '%".$caller_name."%' ";
                $count_query .= " AND caller_id_name LIKE '%".$caller_name."%' ";
            }

            if(strlen($caller_number) > 0){
                $query .= " AND caller_id_number LIKE '%".$caller_number."%' ";
                $count_query .= " AND caller_id_number LIKE '%".$caller_number."%' ";
            }

            if(strlen($module) > 0){
                $query .= " AND module_name LIKE '%".$module."%' ";
                $count_query .= " AND module_name LIKE '%".$module."%' ";
            }

            $query .= " ORDER BY start_stamp desc LIMIT $per_page OFFSET $start";
            $result = pg_query($con, $query);
            
            $count_result = pg_query($con, $count_query);

            $total_rows = 0;
            if (pg_num_rows($count_result) > 0 ) {
                while ($count_row = pg_fetch_assoc($count_result)) {
                    
                    $total_rows = $count_row['total'];
                }
            }


            return array('records'=>$result,'total_rows'=>$total_rows);
        }


        public function fetch_by_extension($con, $id,$per_page,$page,$start_date,$end_date,$extension,$direction,$destination,$caller_name,$caller_number,$module, $hide_internal) {
            $start    = ($page - 1) * $per_page;

            $query = "SELECT xml_cdr_uuid,domain_name,domain_uuid,sip_call_id,extension_uuid,direction,caller_id_name,caller_id_number,destination_number,start_stamp,duration,record_name,status,hangup_cause, SUBSTRING(record_path, POSITION('archive/' IN record_path) + 8) || '/' || record_name as record_url FROM public.v_xml_cdr WHERE domain_uuid ='$id' and leg = 'a' ";

            $count_query = "SELECT count(*) as total FROM public.v_xml_cdr WHERE domain_uuid ='$id' and leg = 'a' ";
            
            if ($hide_internal === true) {
                $query .= " AND direction != 'local' ";
                $count_query .= " AND direction != 'local' ";
            }

            if(strlen($start_date) > 0 && strlen($end_date) > 0){
                $query .= " AND insert_date::date BETWEEN '$start_date' AND '$end_date' ";
                $count_query .= " AND insert_date::date BETWEEN '$start_date' AND '$end_date' ";
            }

            if(strlen($extension) > 0){
                $query .= " AND (caller_id_number = '$extension' or caller_destination = '$extension' or destination_number = '$extension') ";
                $count_query .= " AND (caller_id_number = '$extension' or caller_destination = '$extension' or destination_number = '$extension') ";
            }

            if(strlen($direction) > 0){
                $query .= " AND direction = '$direction' ";
                $count_query .= " AND direction = '$direction' ";
            }

            if(strlen($destination) > 0){
                $query .= " AND destination_number LIKE '%".$destination."%' ";
                $count_query .= " AND destination_number LIKE '%".$destination."%' ";
            }

            if(strlen($caller_name) > 0){
                $query .= " AND caller_id_name LIKE '%".$caller_name."%' ";
                $count_query .= " AND caller_id_name LIKE '%".$caller_name."%' ";
            }

            if(strlen($caller_number) > 0){
                $query .= " AND caller_id_number LIKE '%".$caller_number."%' ";
                $count_query .= " AND caller_id_number LIKE '%".$caller_number."%' ";
            }

            if(strlen($module) > 0){
                $query .= " AND module_name LIKE '%".$module."%' ";
                $count_query .= " AND module_name LIKE '%".$module."%' ";
            }

            $query .= " ORDER BY start_stamp desc LIMIT $per_page OFFSET $start";
            $result = pg_query($con, $query);

            $count_result = pg_query($con, $count_query);

            $total_rows = 0;
            if (pg_num_rows($count_result) > 0 ) {
                while ($count_row = pg_fetch_assoc($count_result)) {
                    
                    $total_rows = $count_row['total'];
                }
            }


            return array('records'=>$result,'total_rows'=>$total_rows);
        }

    }
?>
