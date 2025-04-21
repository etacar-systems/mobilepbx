<?php
// Date :08-08-24 Added by Atul for get cdr history by extension uuid
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
        if (isset($_GET['id'])) {
            $result = $cdr->fetch_by_extension_uuid($con, $_GET['id']);

            if (pg_num_rows($result) > 0 ) {
                $arr = array();
                while ($row = pg_fetch_assoc($result)) {
                    
                    if ($row['record_name'] != "") {
                        $string = $row['record_path'];
                        $pos = strrpos($string, 'recordings');
                        if ($pos !== false) {
                            $newString = substr($string, $pos);
                            //$row['ivr_url'] = "https://api.voipaustralia.au/app/allrecordings/".$newString."/".$row['record_name'];
                        }
                     
                    }

                    $arr[] = $row;
                }

                echo json_encode($arr);
            } else {
                echo json_encode(["message" => "No CDR Found !!"]);
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
