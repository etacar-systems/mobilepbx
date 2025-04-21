<?php
    //headers
    header('Access-Control-Allow-Origin: *');
    header('Content-Type: application/json');



    require("../../config/config.php");
    //require_once "../../../resources/classes/ringbacks.php";
    require("dropdown.php");

    $dropdown = new Dropdown();

    if (!isset($_SERVER['PHP_AUTH_USER']) || !isset($_SERVER['PHP_AUTH_PW'])){
        echo json_encode([
            "message" => "Authentication Failed !!"
        ]);
        return;
    } else {
        $username = $_SERVER['PHP_AUTH_USER'];
        $password = $_SERVER['PHP_AUTH_PW'];
    }

    $check_user = $dropdown->verify_user($con, $username, $password);
    $json_response = json_decode($check_user, true);

    if ($json_response['msg'] == 'true') {

       
     
  
$dialplan_expression = array(
    "^\\\\+?(\\\\d{2})$" => "2 Digits",
    "^\\\\+?(\\\\d{3})$" => "3 Digits",
    "^\\\\+?(\\\\d{4})$" => "4 Digits",
    "^\\\\+?(\\\\d{5})$" => "5 Digits",
    "^\\\\+?(\\\\d{6})$" => "6 Digits",
    "^\\\\+?(\\\\d{7})$" => "7 Digits",
    "^\\\\+?(\\\\d{8})$" => "8 Digits",
    "^\\\\+?(\\\\d{9})$" => "9 Digits",
    "^\\\\+?(\\\\d{10})$" => "10 Digits Long Distance",
    "^\\\\+?(\\\\d{11})$" => "11 Digits Long Distance",
    "^\\\\+?(\\\\^(311)$" => "311 information",
    "^\\\\+?(\\\\^(411)$" => "311 information",
    "^\\\\+?(\\\\^(711)$" => "711 TTY",
    "^\\\\+?(\\\\(^911$|^933$)" => "911 Emergency",
    "^\\\\+?(\\\\(^988$)" => "988 National Suicide Prevention Lifeline",
    "^\\\\+?(\\\\^(\d{12,20})$" => "international",
    "^\\\\+?(\\\\^9(\\d{2}))$" => "Dial 9 then 2 Digits",
    "^\\\\+?(\\\\^9(\\d{3}))$" => "Dial 9 then 3 Digits",
    "^\\\\+?(\\\\^9(\\d{4}))$" => "Dial 9 then 4 Digits",
    "^\\\\+?(\\\\^9(\\d{5}))$" => "Dial 9 then 5 Digits",
    "^\\\\+?(\\\\^9(\\d{6}))$" => "Dial 9 then 6 Digits",
    "^\\\\+?(\\\\^9(\\d{7}))$" => "Dial 9 then 7 Digits",
    "^\\\\+?(\\\\^9(\\d{8}))$" => "Dial 9 then 8 Digits",
    "^\\\\+?(\\\\^9(\\d{9}))$" => "Dial 9 then 9 Digits",
    "^\\\\+?(\\\\^9(\\d{10}))$" => "Dial 9 then 10 Digits",
    "^\\\\+?(\\\\^9(\\d{11}))$" => "Dial 9 then 11 Digits",
    "^\\\\+?(\\\\^9(\\d{12,20})))$" => "Dial 9 then 11 Digits",
     "^\\\\+?(\\\\^9(\\d{12,20})))$" => "Dial 9 then 11 Digits",
);

echo json_encode(array('dialplan_expression'=> $dialplan_expression));
     //echo json_encode(array('recordings'=>$sql3,'ringtones'=>$ringtones_list,'Tones'=>$tone_list));
        
    } else {
        header('WWW-Authenticate: Basic realm="My Realm"');
        header('HTTP/1.0 401 Unauthorized');
        echo json_encode([
            "message" => "Authentication Failed !!"
        ]);
        exit;
    
    }
?>
