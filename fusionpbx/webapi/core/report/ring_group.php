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
        $start_date = (isset($data->start_date)) ? $data->start_date : '' ;
        $end_date = (isset($data->end_date)) ? $data->end_date : '' ;

        $result = $report->fetch_ring_group($con, $domain_uuid, $start_date, $end_date);

        if (pg_num_rows($result) > 0 ) {

            $arr = array();
            $data = array();
            
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

                $data[] = $row;

                // $total_calls += $row['total_calls'];
                // $outbound += $row['outbound_calls'];
                // $answered += $row['answered'];
                // $missed += $row['missed'];
                // $response_sec += $row['response_seconds'];
                // $duration += ($row['inbound_duration'] + $row['outbound_duration']);
            }

          
            $arr['data'] = $data;
           
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