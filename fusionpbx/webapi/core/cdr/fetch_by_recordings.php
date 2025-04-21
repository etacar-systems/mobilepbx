<?php
    //headers
    header('Access-Control-Allow-Origin: *');
    header('Content-Type: application/json');

    require("../../config/config.php");
    require("cdr.php");

    $cdr = new Cdr();

    if (!isset($_SERVER['PHP_AUTH_USER']) || !isset($_SERVER['PHP_AUTH_PW'])){
        echo json_encode([
            "message" => "Authentication Failed !!"
        ]);
        return;
    } else {
        $username = $_SERVER['PHP_AUTH_USER'];
        $password = $_SERVER['PHP_AUTH_PW'];
    }

    $check_user = $cdr->verify_user($con, $username, $password);
    if ($check_user == 'true') {

            $per_page = (isset($_GET['per_page'])) ? $_GET['per_page'] : 30;
            $page= (isset($_GET['page'])) ? $_GET['page'] : 1;

            $start_date= (isset($_GET['start_date'])) ? $_GET['start_date'] : '';
            $end_date= (isset($_GET['end_date'])) ? $_GET['end_date'] : '';
            $extension= (isset($_GET['extension'])) ? $_GET['extension'] : '';
            $direction= (isset($_GET['direction'])) ? $_GET['direction'] : '';
            $destination= (isset($_GET['destination'])) ? $_GET['destination'] : '';
            $caller_name= (isset($_GET['caller_name'])) ? $_GET['caller_name'] : '';
            $caller_number= (isset($_GET['caller_number'])) ? $_GET['caller_number'] : '';
            $module= (isset($_GET['module'])) ? $_GET['module'] : '';

        if (isset($_GET['id'])) {
            $result = $cdr->fetch_by_recordings($con, $_GET['id'],$per_page,$page,$start_date,$end_date,$extension,$direction,$destination,$caller_name,$caller_number,$module);

            if (pg_num_rows($result['records']) > 0 ) {
                $arr = array();
                while ($row = pg_fetch_assoc($result['records'])) {
                    
                    $arr[] = $row;
                }

                $total_rows = $result['total_rows'];
                $total_pages = ceil($total_rows / $per_page); 

                $arr['total_rows'] = $total_rows;
                $arr['total_pages'] = $total_pages;

                echo json_encode($arr);
            } else {
                $arr = array();
                $arr['total_rows'] = 0;
                $arr['total_pages'] = 0;

                echo json_encode($arr);
            }
            
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