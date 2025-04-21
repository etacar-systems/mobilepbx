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

        $result = $report->get_call_metrics($con,$domain_uuid, $extension, $time_zone, $type);

        if ($result && pg_num_rows($result) > 0 ) {

            // $total_inbound = 0;
            // $total_outbound = 0;
            $total_local = 0;
            // $total_answered = 0;
            $total_unanswered = 0;
            $total_missed = 0;

            $arr = array();
            $data = array();
            while ($row = pg_fetch_assoc($result)) {
                $data[] = $row;

                $total_local += $row['local_calls'];
                $total_answered += $row['answered_calls'];
                $total_missed += $row['missed_calls'];
            }

            $arr['data'] = $data;

            $arr['total_counts'] = [
                'total_local' => $total_local,
                'total_answered' => $total_answered,
                'total_missed' => $total_missed,
            ];

            echo json_encode($arr);
        } else {
            echo json_encode([]);
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