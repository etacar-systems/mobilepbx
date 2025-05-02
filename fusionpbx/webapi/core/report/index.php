<?php
    //headers
    header('Access-Control-Allow-Origin: *');
    header('Content-Type: application/json');

    require("../../config/config.php");
    require("report.php");

    $report = new Report();

    if (!isset($_SERVER['PHP_AUTH_USER']) || !isset($_SERVER['PHP_AUTH_PW'])){
        echo json_encode([
            "message" => "Authentication Failed !!"
        ]);
        return;
    } else {
        $username = $_SERVER['PHP_AUTH_USER'];
        $password = $_SERVER['PHP_AUTH_PW'];
    }

    $check_user = $report->verify_user($con, $username, $password);
    if ($check_user == 'true') {

        $data = json_decode(file_get_contents("php://input"));

        $domain_uuid = $data->domain_id;
        $start_date = (isset($data->start_date)) ? $data->start_date : '';
        $extension = (isset($data->extension)) ? $data->extension : '';
        $end_date = (isset($data->end_date)) ? $data->end_date : '';
        $time_zone = (isset($data->time_zone)) ? $data->time_zone : 'Europe/London';

        $result = $report->fetch($con, $domain_uuid, $start_date, $end_date, $extension);

        if (pg_num_rows($result) > 0 ) {

            $arr = array();
            $data = array();
            $total_calls = 0;
            $outbound = 0;
            $local = 0;
            $answered = 0;
            $missed = 0;
            $response_sec = 0;
            $duration = 0;

            $today_total_calls = 0;
            $today_missed_calls = 0;
            $today_answered_calls = 0;

            while ($row = pg_fetch_assoc($result)) {                

                $outbound_per = 0;
                $answer_per = 0;
                $missed_per = 0;
                if($row['total_calls'] > 0){
                    $outbound_per = ($row['outbound_calls']/$row['total_calls']) * 100;
                    $answer_per = ($row['answered']/$row['total_calls']) * 100;
                    $missed_per = ($row['missed']/$row['total_calls']) * 100;
                }

                $row['calld_percentage'] = $outbound_per;
                $row['answer_percentage'] = $answer_per;
                $row['missed_percentage'] = $missed_per;
                $row['total_calls'] = $row['outbound_calls'] + $row['local_calls'] + $row['inbound_calls'];

                $data[] = $row;

                $total_calls += $row['total_calls'];
                $outbound += $row['outbound_calls'];
                $local += $row['local_calls'];
                $answered += $row['answered'];
                $missed += $row['missed'];
                $response_sec += $row['response_seconds'];
                $duration += ($row['inbound_duration'] + $row['outbound_duration'] + $row['local_duration']);
            }

            $call_matrics = $report->get_call_metrics($con, $domain_uuid, $extension, $time_zone, 'today');
            if (pg_num_rows($call_matrics) > 0 ) {
                while ($row = pg_fetch_assoc($call_matrics)) {
                    $today_answered_calls += $row['answered_calls'];
                    $today_total_calls += $row['local_calls'];
                    $today_missed_calls += $row['missed_calls'];
                }
            }

            $today_missed_per = 0;
            if($today_total_calls > 0){                
                $today_missed_per = ($today_missed_calls/$today_total_calls) * 100;
            }

            $arr['data'] = $data;

            $arr['total_counts'] = [
                'total_calls' => $total_calls,
                'today_answered_calls' => $today_answered_calls,
                'total_outbound' => $outbound,
                'total_local' => $local,
                'total_answered' => $answered,
                'total_missed' => $missed,
                'total_duration_sec' => $duration,
                'avg_response_sec' => $response_sec / ($answered == 0 ? 1 : $answered),
                'response_sec' => $response_sec,
                'today_total_calls' => $today_total_calls,
                'today_missed_calls' => $today_missed_calls,
                'today_missed_calls_percentage' => $today_missed_per,
            ];

            $arr['sla'] = [
                'missed_call' => $missed,
                'answered_call' => $answered,
            ];

            $arr['call_comparison'] = [
                'called' => $outbound,
                'local' => $local,
                'answered_call' => $answered,
            ];

            echo json_encode($arr);
        } else {
            echo json_encode(["message" => "No CDR Found !!"]);
        }
    } else {
        header('WWW-Authenticate: Basic realm="My Realm"');
        header('HTTP/1.0 401 Unauthorized');
        echo json_encode([
            "message" => "Authentication Failed !!"
        ]);
        exit;
    }
?>
