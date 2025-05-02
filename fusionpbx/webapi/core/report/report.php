<?php
    require("../../config/config.php");

    class Report {

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
 

        public function fetch($con, $domain_uuid, $start_date, $end_date, $extension) {

            $time_zone = date_default_timezone_get();
            $start_stamp_begin = $start_date.':00.000 '.$time_zone;
            $start_stamp_end = $end_date.':59.999 '.$time_zone;
            $include_internal = true;

            if(strlen($start_date) > 0 && strlen($end_date) > 0){
                $sql_date_range = " and start_stamp between '".$start_stamp_begin."'::timestamptz and '".$start_stamp_end."'::timestamptz \n";

            }else {
                if (!empty($start_date)) {
                    $sql_date_range = "and start_stamp >= '".$start_stamp_begin."'::timestamptz \n";                    
                }
                if (!empty($end_date)) {
                    $sql_date_range .= "and start_stamp <= '".$start_stamp_end."'::timestamptz \n";                    
                }
            }

            //calculate the summary data
                $sql = "select \n";
                $sql .= "e.extension, \n";
                $sql .= "e.effective_caller_id_name as caller_name, \n";
                $sql .= "e.extension_uuid, \n";

                //answered
                $sql .= "count(*) \n";
                $sql .= "filter ( \n";
                $sql .= " where c.extension_uuid = e.extension_uuid \n";
                $sql .= " and missed_call = false\n";
                // if (!permission_exists('xml_cdr_enterprise_leg')) {
                //     $sql .= " and originating_leg_uuid is null \n";
                // }
                // elseif (!permission_exists('xml_cdr_lose_race')) {
                //     $sql .= " and hangup_cause <> 'LOSE_RACE' \n";
                // }
                $sql .= " and (cc_side IS NULL or cc_side !='agent')";
                if ($include_internal) {
                    $sql .= " and (direction = 'inbound' or direction = 'local') \n";
                }
                else {
                    $sql .= "and direction = 'inbound' \n";
                }
                $sql .= ") \n";
                $sql .= "as answered, \n";

                //missed
                $sql .= "count(*) \n";
                $sql .= "filter ( \n";
                $sql .= " where c.extension_uuid = e.extension_uuid \n";
                $sql .= " and missed_call = true\n";
                $sql .= " and (cc_side is null or cc_side != 'agent') \n";
                $sql .= ") \n";
                $sql .= "as missed, \n";

                //cc missed
                $sql .= "count(*) \n";
                $sql .= "filter ( \n";
                $sql .= " where c.extension_uuid = e.extension_uuid \n";
                $sql .= " and c.hangup_cause = 'NO_ANSWER' \n";
                $sql .= " and (cc_side IS NOT NULL or cc_side ='agent')";
                if ($include_internal) {
                    $sql .= " and (direction = 'inbound' or direction = 'local') \n";
                }
                else {
                    $sql .= "and direction = 'inbound' \n";
                }
                $sql .= ") \n";
                $sql .= "as no_answer, \n";

                //busy
                $sql .= "count(*) \n";
                $sql .= "filter ( \n";
                $sql .= " where c.extension_uuid = e.extension_uuid \n";
                $sql .= " and c.hangup_cause = 'USER_BUSY' \n";
                $sql .= " and direction = 'inbound' \n";
                $sql .= ") \n";
                $sql .= "as busy, \n";

                //aloc
                $sql .= "sum(c.billsec) \n";
                $sql .= "filter ( \n";
                $sql .= " where c.extension_uuid = e.extension_uuid \n";
                if (!$include_internal) {
                        $sql .= " and (direction = 'inbound' or direction = 'outbound') \n";
                }
                $sql .= " ) / \n";
                $sql .= "count(*) \n";
                $sql .= "filter ( \n";
                $sql .= " where c.extension_uuid = e.extension_uuid \n";
                if (!$include_internal) {
                        $sql .= " and (direction = 'inbound' or direction = 'outbound') \n";
                }
                $sql .= ") \n";
                $sql .= "as avg_call_length, \n";

                //inbound calls
                $sql .= "count(*) \n";
                $sql .= "filter ( \n";
                $sql .= " where c.extension_uuid = e.extension_uuid \n";
                $sql .= " and (cc_side is null or cc_side != 'agent') \n";
                $sql .= " and direction = 'inbound' \n";
                $sql .= ") \n";
                $sql .= "as inbound_calls, \n";

                //inbound duration
                $sql .= "sum(c.billsec) \n";
                $sql .= "filter ( \n";
                $sql .= " where c.extension_uuid = e.extension_uuid \n";
                $sql .= " and direction = 'inbound') \n";
                $sql .= "as inbound_duration, \n";

                //local calls
                $sql .= "count(*) \n";
                $sql .= "filter ( \n";
                $sql .= " where c.extension_uuid = e.extension_uuid \n";
                $sql .= " and (cc_side is null or cc_side != 'agent') \n";
                $sql .= " and direction = 'local' \n";
                $sql .= ") \n";
                $sql .= "as local_calls, \n";

                //local duration
                $sql .= "sum(c.billsec) \n";
                $sql .= "filter ( \n";
                $sql .= " where c.extension_uuid = e.extension_uuid \n";
                $sql .= " and direction = 'local') \n";
                $sql .= "as local_duration, \n";

                //outbound duration
                $sql .= "count(*) \n";
                $sql .= "filter ( \n";
                $sql .= " where c.extension_uuid = e.extension_uuid \n";
                $sql .= " and c.direction = 'outbound' \n";
                $sql .= ") \n";
                $sql .= "as outbound_calls, \n";

                $sql .= "sum(c.billsec) \n";
                $sql .= "filter ( \n";
                $sql .= " where c.extension_uuid = e.extension_uuid \n";
                $sql .= " and c.direction = 'outbound' \n";
                $sql .= ") \n";
                $sql .= "as outbound_duration, \n";

                //response sec
                $sql .= " sum(extract(epoch from (answer_stamp - start_stamp))) \n";
                $sql .= "filter ( \n";
                $sql .= " where c.extension_uuid = e.extension_uuid \n";
                $sql .= " and missed_call = false and duration IS NOT NULL \n";
                $sql .= " and (cc_side IS NULL or cc_side !='agent')";
                if ($include_internal) {
                    $sql .= " and (direction = 'inbound' or direction = 'local') \n";
                }
                else {
                    $sql .= "and direction = 'inbound' \n";
                }
                $sql .= ") \n";
                $sql .= "as response_seconds, \n";

                //total calls
                $sql .= "count(*) \n";
                $sql .= "filter ( \n";
                $sql .= " where c.extension_uuid = e.extension_uuid and c.leg = 'a' \n";
                $sql .= ") \n";
                $sql .= "as total_calls \n";

                $sql .= "from v_extensions as e \n";
                $sql .= "JOIN v_domains AS d ON d.domain_uuid = e.domain_uuid \n";
                $sql .= "LEFT JOIN ( \n";
                $sql .= " select \n";
                $sql .= " domain_uuid, \n";
                $sql .= " extension_uuid, \n";
                $sql .= " caller_id_number, \n";
                $sql .= " destination_number, \n";
                $sql .= " missed_call, \n";
                $sql .= " answer_stamp, \n";
                $sql .= " bridge_uuid, \n";
                $sql .= " direction, \n";
                $sql .= " start_stamp, \n";
                $sql .= " hangup_cause, \n";
                $sql .= " originating_leg_uuid, \n";
                $sql .= " billsec, \n";
                $sql .= " cc_side, \n";
                $sql .= " sip_hangup_disposition, \n";
                $sql .= " voicemail_message, leg, duration \n";
                $sql .= " from v_xml_cdr \n";

                $sql .= " where domain_uuid = '".$domain_uuid."' \n";
                if ($extension) {
                    $sql .= " AND extension_uuid = '$extension' ";
                }
                $sql .= $sql_date_range;
                $sql .= ") as c ON c.extension_uuid = e.extension_uuid \n";
                $sql .= "where \n";
                $sql .= "d.domain_uuid = e.domain_uuid \n";
                $sql .= " and e.domain_uuid = '".$domain_uuid."' \n";

                $sql .= "group by e.extension, e.effective_caller_id_name, e.extension_uuid \n";
                $sql .= "order by extension asc \n";

            $result = pg_query($con, $sql);

            return $result;
        }

        public function get_call_metrics($con, $domain_uuid, $extension, $time_zone, $type) {
            $sql = "WITH intervals AS ( ";

            if ($type == "year") {
                $sql .= "SELECT generate_series(date_trunc('year', CURRENT_TIMESTAMP AT TIME ZONE '$time_zone'), date_trunc('year', CURRENT_TIMESTAMP AT TIME ZONE '$time_zone') + INTERVAL '1 year' - INTERVAL '1 month', INTERVAL '1 month') AS interval), ";
                $date_trunc = "month";
            } else if ($type == "month") {
                $sql .= "SELECT generate_series(date_trunc('month', CURRENT_TIMESTAMP AT TIME ZONE '$time_zone'), date_trunc('month', CURRENT_TIMESTAMP AT TIME ZONE '$time_zone') + INTERVAL '1 month' - INTERVAL '1 day', INTERVAL '1 day') AS interval), ";
                $date_trunc = "day";
            } else if ($type == "week") {
                $sql .= "SELECT generate_series(date_trunc('week', CURRENT_TIMESTAMP AT TIME ZONE '$time_zone'), date_trunc('week', CURRENT_TIMESTAMP AT TIME ZONE '$time_zone') + INTERVAL '1 week' - INTERVAL '1 day', INTERVAL '1 day') AS interval), ";
                $date_trunc = "day";
            } else {
                // TODAY
                $sql .= "SELECT generate_series(date_trunc('day', CURRENT_TIMESTAMP AT TIME ZONE '$time_zone'), date_trunc('day', CURRENT_TIMESTAMP AT TIME ZONE '$time_zone') + INTERVAL '1 day' - INTERVAL '1 hour', INTERVAL '1 hour') AS interval), ";
                $date_trunc = "hour";
            }

            $sql .= "stats AS ( ";
            $sql .= "   SELECT ";
            $sql .= "   SUM(CASE WHEN missed_call = 'true' 
                                AND (cc_side IS NULL OR cc_side != 'agent') 
                                AND (direction = 'inbound' OR direction = 'local') 
                            THEN 1 
                            ELSE 0 
                        END) AS missed_calls, ";
            $sql .= "   SUM(CASE WHEN missed_call = 'false' 
                            AND (cc_side IS NULL OR cc_side != 'agent') 
                            AND (direction = 'inbound' OR direction = 'local') 
                            THEN 1 
                            ELSE 0 
                        END) AS answered_calls, ";
            $sql .= "   SUM(CASE WHEN direction = 'inbound' 
                            AND (cc_side IS NULL OR cc_side != 'agent') 
                            THEN 1 
                            ELSE 0 
                        END) AS inbound_calls, ";
            $sql .= "   SUM(CASE WHEN direction = 'outbound' THEN 1 ELSE 0 END) AS outbound_calls, ";
            $sql .= "   SUM(CASE WHEN direction = 'local' 
                            AND (cc_side IS NULL OR cc_side != 'agent') 
                            THEN 1 
                            ELSE 0 
                        END) AS local_calls, ";
            $sql .= "       date_trunc('$date_trunc', start_stamp AT TIME ZONE '$time_zone') AS step_interval ";
            $sql .= "   FROM v_xml_cdr ";
            $sql .= "   WHERE domain_uuid = '$domain_uuid' ";
            if ($extension) {
                $sql .= "AND extension_uuid = '$extension' ";
            }
            $sql .= "   GROUP BY step_interval) ";

            $sql .= "SELECT ";
            $sql .= "    intervals.interval, ";
            $sql .= "    COALESCE(stats.missed_calls, 0) AS missed_calls, " ;
            $sql .= "    COALESCE(stats.answered_calls, 0) AS answered_calls, " ;
            $sql .= "    COALESCE(stats.inbound_calls, 0) AS inbound_calls, ";
            $sql .= "    COALESCE(stats.outbound_calls, 0) AS outbound_calls, ";
            $sql .= "    COALESCE(stats.local_calls, 0) AS local_calls ";
            $sql .= "FROM intervals ";
            $sql .= "LEFT JOIN stats ON intervals.interval = stats.step_interval " ;
            $sql .= "ORDER BY intervals.interval";

            $result = pg_query($con, $sql);

            return $result;
        }

        public function fetch_call_matrics($con, $domain_uuid, $extension, $type)
        {
            if (empty(trim($extension))) {
                // echo json_encode([
                //     "msg"     => 'Extension cannot be EMPTY !'
                // ]);
                // return;
            } elseif (empty(trim($domain_uuid))) {
                echo json_encode([
                    "msg"     => 'Domain id Cannot be EMPTY !'
                ]);
                return;
            } elseif (empty(($type))) {
                echo json_encode([
                    "msg"     => 'Type Cannot be EMPTY !'
                ]);
                return;
            }

            $include_internal = true;

            if($type == 'today'){

                $start_date = date('Y-m-d').' 00:00';
                $end_date = date('Y-m-d').' 23:59';

            }else if($type == 'week'){
                $start_date = date('Y-m-d',strtotime('monday this week')).' 00:01'; 
                $end_date = date('Y-m-d',strtotime('sunday this week')).' 23:59';

            }else if($type == 'month'){
                $start_date = date('Y-m-01').' 00:01'; 
                $end_date = date('Y-m-t').' 23:59';

            }else if($type == 'year'){
                $start_date = date('Y-01-01').' 00:01'; 
                $end_date = date('Y-12-31').' 23:59';
            }

            $time_zone = date_default_timezone_get();
            $start_stamp_begin = $start_date.$time_zone;
            $start_stamp_end = $end_date.$time_zone;

            if(strlen($start_date) > 0 && strlen($end_date) > 0){
                $sql_date_range = " and start_stamp between '".$start_stamp_begin."'::timestamptz and '".$start_stamp_end."'::timestamptz \n";

            }

            if($type == 'today'){
                $sql = "WITH hours AS ( \n";
                $sql .= "   SELECT generate_series( \n";
                $sql .= "        '".$start_date."'::timestamp, \n";  
                $sql .= "        '".$end_date."'::timestamp, \n";
                $sql .= "        interval '1 hour' \n";
                $sql .= "    ) AS hour \n";
                $sql .= " ) \n";
            }

            if($type == 'week'){

                $sql = "WITH days AS ( \n";
                $sql .= "   SELECT generate_series( \n";
                $sql .= "        date_trunc('week', CURRENT_DATE), \n";  
                $sql .= "        date_trunc('week', CURRENT_DATE) + interval '6 days', \n";
                $sql .= "        interval '1 day' \n";
                $sql .= "    ) AS day \n";
                $sql .= " ) \n";
            }

            if($type == 'month'){

                $sql = "WITH days AS ( \n";
                $sql .= "   SELECT generate_series( \n";
                $sql .= "        date_trunc('month', CURRENT_DATE), \n";  
                $sql .= "        date_trunc('month', CURRENT_DATE) + interval '1 month' - interval '1 day', \n";
                $sql .= "        interval '1 day' \n";
                $sql .= "    ) AS day \n";
                $sql .= " ) \n";
            }

            if($type == 'year'){

                $sql = "WITH months AS ( \n";
                $sql .= "   SELECT generate_series( \n";
                $sql .= "        date_trunc('year', CURRENT_DATE), \n";  
                $sql .= "        date_trunc('year', CURRENT_DATE) + interval '1 year' - interval '1 month', \n";
                $sql .= "        interval '1 month' \n";
                $sql .= "    ) AS month \n";
                $sql .= " ) \n";
            }


            $sql .= " SELECT \n";

            if($type == 'today'){ 
                $sql .= "    TO_CHAR(hours.hour, 'HH12:MI am') AS hour, \n";
            }
            if($type == 'week' || $type == 'month'){ 
                $sql .= "    TO_CHAR(days.day, 'YYYY-MM-DD') AS date, \n";
                $sql .= "    TO_CHAR(days.day, 'Day') AS day, \n";
            }

            if($type == 'year'){ 
                $sql .= "    TO_CHAR(months.month, 'Month') AS month_name, \n";
            }
            
            $sql .= "    COALESCE(COUNT(v.start_stamp), 0) AS total_calls, \n";

            //inbound calls
            $sql .= "COUNT(*) \n";
            $sql .= "filter ( \n";
            $sql .= " where (cc_side is null or cc_side != 'agent') \n";
            $sql .= " and direction = 'inbound' \n";
            $sql .= ") \n";
            $sql .= "as inbound_calls, \n";

            //local calls
            $sql .= "COUNT(*) \n";
            $sql .= "filter ( \n";
            $sql .= " where (cc_side is null or cc_side != 'agent') \n";
            $sql .= " and direction = 'local' \n";
            $sql .= ") \n";
            $sql .= "as local_calls, \n";

            //outbound_calls
            $sql .= "COUNT(*) \n";
            $sql .= "filter ( \n";
            $sql .= " where direction = 'outbound' \n";
            $sql .= ") \n";
            $sql .= "as outbound_calls, \n";

            //cc missed
            $sql .= "COUNT(*) \n";
            $sql .= "filter ( \n";
            $sql .= " where hangup_cause = 'NO_ANSWER' \n";
            $sql .= " and (cc_side IS NOT NULL or cc_side ='agent')";
            if ($include_internal) {
                $sql .= " and (direction = 'inbound' or direction = 'local') \n";
            }
            else {
                $sql .= "and direction = 'inbound' \n";
            }
            $sql .= ") \n";
            $sql .= "as no_answer, \n";

            //answered
            $sql .= "COUNT(*) \n";
            $sql .= "filter ( \n";
            $sql .= " where missed_call = false\n";
            $sql .= " and (cc_side IS NULL or cc_side !='agent')";
            if ($include_internal) {
                $sql .= " and (direction = 'inbound' or direction = 'local') \n";
            }
            else {
                $sql .= "and direction = 'inbound' \n";
            }
            $sql .= ") \n";
            $sql .= "as answered, \n";

            //missed
            $sql .= "count(*) \n";
            $sql .= "filter ( \n";
            $sql .= " where missed_call = true\n";
            $sql .= " and (cc_side is null or cc_side != 'agent') \n";
            $sql .= ") \n";
            $sql .= "as missed \n";


            $sql .= " FROM \n";
            if($type == 'today'){ 
                $sql .= "    hours \n";
            }
            if($type == 'week' || $type == 'month'){ 
                $sql .= "    days \n";
            }
            if($type == 'year'){ 
                $sql .= "    months \n";
            }
            
            $sql .= "LEFT JOIN \n";

            if($type == 'today'){ 
                $sql .= "    v_xml_cdr v ON date_trunc('hour', v.start_stamp) = hours.hour \n";
            }
            if($type == 'week' || $type == 'month'){ 
                $sql .= "    v_xml_cdr v ON date_trunc('day', v.start_stamp) = days.day \n";
            }
            if($type == 'year'){ 
                $sql .= "    v_xml_cdr v ON date_trunc('month', v.start_stamp) = months.month \n";
            }

            $sql .= " and v.domain_uuid = '".$domain_uuid."' \n";

            $sql .= $sql_date_range ;

            if($type == 'today'){ 
                $group_by = "hours.hour";
            }
            if($type == 'week' || $type == 'month'){ 
                $group_by = "days.day";
            }
            if($type == 'year'){ 
                $group_by = " months.month \n";
            }

            //$sql .= " where v.domain_uuid = '".$domain_uuid."' \n";

            $sql .= " GROUP BY  \n";
            $sql .= $group_by." \n";
            $sql .= " ORDER BY \n";
            $sql .= $group_by." \n";

            $result = pg_query($con, $sql);

            return $result;
        }


        public function fetch_missed_calls($con, $domain_uuid, $extension, $time_zone, $type) {
            $sql = "WITH intervals AS ( ";

            if ($type == "year") {
                $sql .= "SELECT generate_series(date_trunc('year', CURRENT_TIMESTAMP AT TIME ZONE '$time_zone'), date_trunc('year', CURRENT_TIMESTAMP AT TIME ZONE '$time_zone') + INTERVAL '1 year' - INTERVAL '1 month', INTERVAL '1 month') AS interval), ";
                $date_trunc = "month";
            } else if ($type == "month") {
                $sql .= "SELECT generate_series(date_trunc('month', CURRENT_TIMESTAMP AT TIME ZONE '$time_zone'), date_trunc('month', CURRENT_TIMESTAMP AT TIME ZONE '$time_zone') + INTERVAL '1 month' - INTERVAL '1 day', INTERVAL '1 day') AS interval), ";
                $date_trunc = "day";
            } else if ($type == "week") {
                $sql .= "SELECT generate_series(date_trunc('week', CURRENT_TIMESTAMP AT TIME ZONE '$time_zone'), date_trunc('week', CURRENT_TIMESTAMP AT TIME ZONE '$time_zone') + INTERVAL '1 week' - INTERVAL '1 day', INTERVAL '1 day') AS interval), ";
                $date_trunc = "day";
            } else {
                // TODAY
                $sql .= "SELECT generate_series(date_trunc('day', CURRENT_TIMESTAMP AT TIME ZONE '$time_zone'), date_trunc('day', CURRENT_TIMESTAMP AT TIME ZONE '$time_zone') + INTERVAL '1 day' - INTERVAL '1 hour', INTERVAL '1 hour') AS interval), ";
                $date_trunc = "hour";
            }

            $sql .= "stats AS ( ";
            $sql .= "   SELECT ";
            $sql .= "       SUM(CASE WHEN (answer_epoch - start_epoch) > 0 THEN answer_epoch - start_epoch ELSE 0 END) AS total_response_time, ";
            $sql .= "       SUM(CASE WHEN missed_call = 'true' THEN 1 ELSE 0 END) AS missed_calls, ";
            $sql .= "       count(*) AS total_calls, ";
            $sql .= "       SUM(CASE WHEN missed_call = 'false' THEN 1 ELSE 0 END) AS answered_calls, ";
            $sql .= "       date_trunc('$date_trunc', start_stamp AT TIME ZONE '$time_zone') AS step_interval ";
            $sql .= "   FROM v_xml_cdr ";
            $sql .= "   WHERE domain_uuid = '$domain_uuid' ";
            if ($extension) {
                $sql .= "AND extension_uuid = '$extension' ";
            }
            $sql .= "   GROUP BY step_interval) ";

            $sql .= "SELECT ";
            $sql .= "    intervals.interval, ";
            $sql .= "    COALESCE(stats.missed_calls, 0) AS missed_calls, " ;
            $sql .= "    COALESCE(stats.total_response_time, 0) AS total_response_time, " ;
            $sql .= "    COALESCE(stats.answered_calls, 0) AS answered_calls, ";
            $sql .= "    COALESCE(stats.total_calls, 0) AS total_calls ";
            $sql .= "FROM intervals ";
            $sql .= "LEFT JOIN stats ON intervals.interval = stats.step_interval " ;
            $sql .= "ORDER BY intervals.interval";

            $result = pg_query($con, $sql);

            return $result;
        }


        public function fetch_ring_group($con, $domain_uuid,$start_date,$end_date) {

            $time_zone = date_default_timezone_get();
            $start_stamp_begin = $start_date.':00.000 '.$time_zone;
            $start_stamp_end = $end_date.':59.999 '.$time_zone;
            $include_internal = true;

            if(strlen($start_date) > 0 && strlen($end_date) > 0){
                $sql_date_range = " and start_stamp between '".$start_stamp_begin."'::timestamptz and '".$start_stamp_end."'::timestamptz \n";

            }else {
                if (!empty($start_date)) {
                    $sql_date_range = "and start_stamp >= '".$start_stamp_begin."'::timestamptz \n";                    
                }
                if (!empty($end_date)) {
                    $sql_date_range .= "and start_stamp <= '".$start_stamp_end."'::timestamptz \n";                    
                }
            }

            //calculate the summary data
                $sql = "select \n";
                $sql .= "r.ring_group_uuid,r.ring_group_extension, r.ring_group_name,\n";

                //answered
                $sql .= "count(*) \n";
                $sql .= "filter ( \n";
                $sql .= " where (c.caller_id_number = r.ring_group_extension or c.caller_destination = r.ring_group_extension or c.destination_number = r.ring_group_extension) \n";
                $sql .= " and missed_call = false\n";
                $sql .= " and (cc_side IS NULL or cc_side !='agent')";
                if ($include_internal) {
                    $sql .= " and (direction = 'inbound' or direction = 'local') \n";
                }
                else {
                    $sql .= "and direction = 'inbound' \n";
                }
                $sql .= ") \n";
                $sql .= "as answered, \n";

                //missed
                $sql .= "count(*) \n";
                $sql .= "filter ( \n";
                $sql .= " where (c.caller_id_number = r.ring_group_extension or c.caller_destination = r.ring_group_extension or c.destination_number = r.ring_group_extension) \n";
                $sql .= " and missed_call = true\n";
                $sql .= " and (cc_side is null or cc_side != 'agent') \n";
                $sql .= ") \n";
                $sql .= "as missed, \n";

                //cc missed
                $sql .= "count(*) \n";
                $sql .= "filter ( \n";
                $sql .= " where (c.caller_id_number = r.ring_group_extension or c.caller_destination = r.ring_group_extension or c.destination_number = r.ring_group_extension) \n";
                $sql .= " and c.hangup_cause = 'NO_ANSWER' \n";
                $sql .= " and (cc_side IS NOT NULL or cc_side ='agent')";
                if ($include_internal) {
                    $sql .= " and (direction = 'inbound' or direction = 'local') \n";
                }
                else {
                    $sql .= "and direction = 'inbound' \n";
                }
                $sql .= ") \n";
                $sql .= "as no_answer, \n";

                //busy
                $sql .= "count(*) \n";
                $sql .= "filter ( \n";
                $sql .= " where (c.caller_id_number = r.ring_group_extension or c.caller_destination = r.ring_group_extension or c.destination_number = r.ring_group_extension) \n";
                $sql .= " and c.hangup_cause = 'USER_BUSY' \n";
                if ($include_internal) {
                        $sql .= " and (direction = 'inbound' or direction = 'local') \n";
                }
                else {
                        $sql .= " and direction = 'inbound' \n";
                }
                $sql .= ") \n";
                $sql .= "as busy, \n";

                //aloc
                $sql .= "sum(c.billsec) \n";
                $sql .= "filter ( \n";
                $sql .= " where (c.caller_id_number = r.ring_group_extension or c.caller_destination = r.ring_group_extension or c.destination_number = r.ring_group_extension) \n";
                if (!$include_internal) {
                        $sql .= " and (direction = 'inbound' or direction = 'outbound') \n";
                }
                $sql .= " ) / \n";
                $sql .= "count(*) \n";
                $sql .= "filter ( \n";
                $sql .= " where (c.caller_id_number = r.ring_group_extension or c.caller_destination = r.ring_group_extension or c.destination_number = r.ring_group_extension) \n";
                if (!$include_internal) {
                        $sql .= " and (direction = 'inbound' or direction = 'outbound') \n";
                }
                $sql .= ") \n";
                $sql .= "as avg_call_length, \n";

                //inbound calls
                $sql .= "count(*) \n";
                $sql .= "filter ( \n";
                $sql .= " where (c.caller_id_number = r.ring_group_extension or c.caller_destination = r.ring_group_extension or c.destination_number = r.ring_group_extension) \n";
                $sql .= " and (cc_side is null or cc_side != 'agent') \n";
                if ($include_internal) {
                        $sql .= " and (direction = 'inbound' or direction = 'local') \n";
                }
                else {
                        $sql .= " and direction = 'inbound' \n";
                }
                $sql .= ") \n";
                $sql .= "as inbound_calls, \n";

                //inbound duration
                $sql .= "sum(c.billsec) \n";
                $sql .= "filter ( \n";
                $sql .= " where (c.caller_id_number = r.ring_group_extension or c.caller_destination = r.ring_group_extension or c.destination_number = r.ring_group_extension) \n";
                if ($include_internal) {
                        $sql .= " and (direction = 'inbound' or direction = 'local')) \n";
                }
                else {
                        $sql .= " and direction = 'inbound') \n";
                }
                $sql .= "as inbound_duration, \n";

                //outbound duration
                $sql .= "count(*) \n";
                $sql .= "filter ( \n";
                $sql .= " where (c.caller_id_number = r.ring_group_extension or c.caller_destination = r.ring_group_extension or c.destination_number = r.ring_group_extension) \n";
                $sql .= " and c.direction = 'outbound' \n";
                $sql .= ") \n";
                $sql .= "as outbound_calls, \n";

                $sql .= "sum(c.billsec) \n";
                $sql .= "filter ( \n";
                $sql .= " where (c.caller_id_number = r.ring_group_extension or c.caller_destination = r.ring_group_extension or c.destination_number = r.ring_group_extension) \n";
                $sql .= " and c.direction = 'outbound' \n";
                $sql .= ") \n";
                $sql .= "as outbound_duration, \n";

                //response sec
                $sql .= " sum(extract(epoch from (answer_stamp - start_stamp))) \n";
                $sql .= "filter ( \n";
                $sql .= " where (c.caller_id_number = r.ring_group_extension or c.caller_destination = r.ring_group_extension or c.destination_number = r.ring_group_extension) \n";
                $sql .= " and missed_call = false\n";
                $sql .= " and (cc_side IS NULL or cc_side !='agent')";
                if ($include_internal) {
                    $sql .= " and (direction = 'inbound' or direction = 'local') \n";
                }
                else {
                    $sql .= "and direction = 'inbound' \n";
                }
                $sql .= ") \n";
                $sql .= "as response_seconds, \n";

                //total calls
                $sql .= "count(*) \n";
                $sql .= "filter ( \n";
                $sql .= " where c.caller_id_number = r.ring_group_extension or c.caller_destination = r.ring_group_extension or c.destination_number = r.ring_group_extension \n";
                $sql .= ") \n";
                $sql .= "as total_calls \n";

                $sql .= "from v_ring_groups as r \n";
                $sql .= "JOIN v_domains AS d ON d.domain_uuid = r.domain_uuid \n";
                $sql .= "LEFT JOIN LATERAL ( select \n";
                $sql .= " domain_uuid, \n";
                $sql .= " extension_uuid, \n";
                $sql .= " caller_id_number, \n";
                $sql .= " caller_destination, \n";
                $sql .= " destination_number, \n";
                $sql .= " missed_call, \n";
                $sql .= " answer_stamp, \n";
                $sql .= " bridge_uuid, \n";
                $sql .= " direction, \n";
                $sql .= " start_stamp, \n";
                $sql .= " hangup_cause, \n";
                $sql .= " originating_leg_uuid, \n";
                $sql .= " billsec, \n";
                $sql .= " cc_side, \n";
                $sql .= " sip_hangup_disposition, \n";
                $sql .= " voicemail_message \n";
                $sql .= " from v_xml_cdr \n";

                $sql .= " where domain_uuid = '".$domain_uuid."' ";
                // and module_name = 'ring_group' \n";
                $sql .= $sql_date_range;
                $sql .= ") as c ON true \n";
                $sql .= "where \n";
                $sql .= "d.domain_uuid = r.domain_uuid \n";
                $sql .= " and r.domain_uuid = '".$domain_uuid."' \n";

                $sql .= "group by r.ring_group_uuid, r.ring_group_extension, r.ring_group_name \n";
                $sql .= "order by ring_group_extension asc \n";

            $result = pg_query($con, $sql);

            return $result;
        }

    }
?>
