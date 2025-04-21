<?php
    //headers
    header('Access-Control-Allow-Origin: *');
    header('Content-Type: application/json');
    header('Access-Control-Allow-Methods: POST');
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
        $id = $json_response['id'];
        $data = json_decode(file_get_contents("php://input"));

        $username = $data->username;
        $password = $data->password;
        $confirm_password = $data->confirm_password;
        $email = $data->email;
        $language = $data->language;
        $timezone = $data->timezone;
        $first_name = $data->first_name;
        $last_name = $data->last_name;
        $organization = $data->organization;
        $user_groups = $data->user_groups;
        $domain = $data->domain;
        $user_enabled = $data->user_enabled;
        
        $array_group = explode("|", $user_groups);
        $groups = $array_group[0];
        $groups_name = $array_group[1];

        $uuid = Uuid::uuid4();
        // Get the UUID as a string
        $uuidContact = $uuid->toString();

        $uuid = Uuid::uuid4();
        // Get the UUID as a string
        $uuidUser = $uuid->toString();

        $uuid = Uuid::uuid4();
        // Get the UUID as a string
        $uuidUserGroup = $uuid->toString();

        $uuid = Uuid::uuid4();
        // Get the UUID as a string
        $uuidUserSettingTimezone = $uuid->toString();

        $uuid = Uuid::uuid4();
        // Get the UUID as a string
        $uuidUserSettingLanguage = $uuid->toString();

        if ($user_enabled == "true" || $user_enabled == "false") {
            $user->post($con, $username, $password, $confirm_password, $email, $language, $timezone, $first_name, $last_name, $organization, $groups, $groups_name, $domain, $user_enabled, $uuidContact, $uuidUser, $uuidUserGroup, $uuidUserSettingLanguage, $uuidUserSettingTimezone, $id);
        } else {
            echo json_encode([
                "message" => "User Enabled Value Must be either True or False !!"
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