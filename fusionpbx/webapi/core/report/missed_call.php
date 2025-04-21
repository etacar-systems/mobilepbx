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
        $extension = (isset($data->extension)) ? $data->extension : '';
        $type = (isset($data->type)) ? $data->type : 'today';
        $time_zone = (isset($data->time_zone)) ? $data->time_zone : 'Europe/London';

        $result = $report->fetch_missed_calls($con, $domain_uuid, $extension, $time_zone, $type);

        if (pg_num_rows($result) > 0 ) {
            $arr = array();
            $data = array();
            $total_calls = 0;
            $missed_calls = 0;
            $answered_calls = 0;
            $total_response_time = 0;


            while ($row = pg_fetch_assoc($result)) {
                $data[] = $row;
                $total_calls += $row['total_calls'];
                $missed_calls += $row['missed_calls'];
                $answered_calls += $row['answered_calls'];
                $total_response_time += $row['total_response_time'];
            }

            if ($answered_calls != 0) {
                $arr['total_counts'] = [
                    'total_missed' => $missed_calls,
                    'total_calls' => $total_calls,
                    'average_waiting_time' => $total_response_time / $answered_calls,
                ];
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