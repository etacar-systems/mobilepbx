<?php
    require("../../config/config.php");
    require("../../vendor/autoload.php");
    require("../classes/validateExtension.php");
    require("../ivr/ivr.php");
    
    use Ramsey\Uuid\Uuid;

    $ivr = new IVR();

    if (!isset($_SERVER['PHP_AUTH_USER']) || !isset($_SERVER['PHP_AUTH_PW'])){
        echo json_encode([
            "message" => "Authentication Failed !!"
        ]);
        return;
    } else {
        $username = $_SERVER['PHP_AUTH_USER'];
        $password = $_SERVER['PHP_AUTH_PW'];
    }

    $check_user = $ivr->verify_user($con, $username, $password);
    $json_response = json_decode($check_user, true);

    if ($json_response['msg'] == 'true') {

        $data = json_decode(file_get_contents("php://input"));

        $extension = $data->extension;
        $domain = $data->domain_id;

        $check_ext = validateExtension::validate($con,$extension,$domain);

        if(!isset($check_ext['app'])){

            echo json_encode([
                "success" => true,
                "message" => " Extension not available !!"
            ]);

        }else{
            echo json_encode([
                "success" => false,
                "message" => $check_ext['extension']." ".$check_ext['app']." alreay available !!"
            ]);
        }

    }

?>
