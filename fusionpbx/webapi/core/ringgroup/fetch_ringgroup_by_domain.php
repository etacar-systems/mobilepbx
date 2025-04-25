<?php
    //headers
    header('Access-Control-Allow-Origin: *');
    header('Content-Type: application/json');

    require("../../config/config.php");
    require("ringgroup.php");

    $ringGroup = new RingGroup();

    if (!isset($_SERVER['PHP_AUTH_USER']) || !isset($_SERVER['PHP_AUTH_PW'])){
        echo json_encode([
            "message" => "Authentication Failed !!"
        ]);
        return;
    } else {
        $username = $_SERVER['PHP_AUTH_USER'];
        $password = $_SERVER['PHP_AUTH_PW'];
    }

    $check_user = $ringGroup->verify_user($con, $username, $password);
    $json_response = json_decode($check_user, true);

    if ($json_response['msg'] == 'true') {
        if (isset($_GET['id'])) {
            $limit = isset($_GET['limit']) ? (int)$_GET['limit'] : 10;
            $page = isset($_GET['page']) ? (int)$_GET['page'] : 1;
            $search = isset($_GET['search']) ? $_GET['search'] : '';
            $sort_column = isset($_GET['sort_column']) ? $_GET['sort_column'] : '';
            $sort_direction = isset($_GET['sort_direction']) ? $_GET['sort_direction'] : 'asc';

            $result = $ringGroup->fetch_by_domain($con, $_GET['id'], $limit, $page, $search, $sort_column, $sort_direction);

            $data = $result['result'];
            $total_count = $result['total_count'];//['count'];

            $total = (int)pg_fetch_assoc($total_count)['count'];
            $arr = array();

            if (pg_num_rows($data) > 0 ) {
                while ($row = pg_fetch_assoc($data)) {
                    $arr[] = $row;
                }
            }

            echo json_encode([
                'data' => $arr, 
                'total' => $total,
            ]);
        } else {
            echo json_encode(
                [
                    "message" => "Invalid Ring Group ID !!"
                ]
            );
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