<?php
    //headers
    header('Access-Control-Allow-Origin: *');
    header('Content-Type: application/json');

    require("../../config/config.php");
    require("recording.php");

    $recording = new Recording();

    function isValidDate($year, $month, $day) {
      return checkdate(date('m', strtotime($month)), $day, $year);
    }

    if (!isset($_SERVER['PHP_AUTH_USER']) || !isset($_SERVER['PHP_AUTH_PW'])){
        echo json_encode([
            "message" => "Authentication Failed !!"
        ]);
        return;
    } else {
        $username = $_SERVER['PHP_AUTH_USER'];
        $password = $_SERVER['PHP_AUTH_PW'];
    }

    $check_user = $recording->verify_user($con, $username, $password);
    $json_response = json_decode($check_user, true);

    if ($json_response['msg'] == 'true') {
      $domain = $_GET['domain'];
      $year = $_GET['year'];
      $month = $_GET['month'];
      $day = $_GET['day'];
      $filename = $_GET['filename'];

      $filePath = "/var/lib/freeswitch/recordings/{$domain}/archive/{$year}/{$month}/{$day}/{$filename}.wav";

      if (file_exists($filePath)) {
        header('Content-Type: audio/wav');
        header('Content-Disposition: inline; filename="' . $filename . '.wav"');

        readfile($filePath);
      } else {
        http_response_code(404);
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