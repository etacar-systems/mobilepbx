<?php
    //headers
    header('Access-Control-Allow-Origin: *');
    header('Content-Type: application/json');
    header('Access-Control-Allow-Methods: PUT');
    header('Access-Control-Allow-Headers: Access-Control-Allow-Headers,Content-Type,Access-Control-Allow-Methods,Authorization,');

    require("../../config/config.php");
    require("../../vendor/autoload.php");
    
    use Ramsey\Uuid\Uuid;

    require("user.php");

    $user = new User();

    if (!isset($_SERVER['PHP_AUTH_USER']) || !isset($_SERVER['PHP_AUTH_PW'])){
        echo json_encode([
            "message" => "Authentication Failed !!"
        ]);
        return;
    } else {
        $username = $_SERVER['PHP_AUTH_USER'];
        $password = $_SERVER['PHP_AUTH_PW'];
    }

    $check_user = $user->verify_user($con, $username, $password);
    $json_response = json_decode($check_user, true);

    if ($json_response['msg'] == 'true') {
        if ($_SERVER['REQUEST_METHOD'] === 'PUT') {

            $data = json_decode(file_get_contents("php://input"));

            $password = $data->password;
            $confirm_password = $data->confirm_password;
            $email = $data->email;
            $language = $data->language;
            $timezone = $data->timezone;
            $user_groups = $data->user_groups;
            $user_enabled = $data->user_enabled;
            $user_id = $data->user_id;
            
            $array_group = explode("|", $user_groups);
            $groups = $array_group[0];
            $groups_name = $array_group[1];

            if ($user_enabled == "true" || $user_enabled == "false") {
                $user->update($con, $password, $confirm_password, $email, $language, $timezone, $groups, $groups_name, $user_enabled, $user_id);
            } else {
                echo json_encode([
                    "message" => "User Enabled Value Must be either True or False !!"
                ]);
            }
        } else {
            echo json_encode([
                "message" => "Invalid Request !!"
            ]);
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