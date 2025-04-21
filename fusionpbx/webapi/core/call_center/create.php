<?php
    //headers
    header('Access-Control-Allow-Origin: *');
    header('Content-Type: application/json');
    header('Access-Control-Allow-Methods: POST');
    header('Access-Control-Allow-Headers: Access-Control-Allow-Headers,Content-Type,Access-Control-Allow-Methods,Authorization,');

    require("../../config/config.php");
    require("../../vendor/autoload.php");
    
    use Ramsey\Uuid\Uuid;

    require("call_center.php");
    $call_center = new Call_center();

    if (!isset($_SERVER['PHP_AUTH_USER']) || !isset($_SERVER['PHP_AUTH_PW'])){
        echo json_encode([
            "message" => "Authentication Failed !!"
        ]);
        return;
    } else {
        $username = $_SERVER['PHP_AUTH_USER'];
        $password = $_SERVER['PHP_AUTH_PW'];
    }

    $check_user = $call_center->verify_user($con, $username, $password);
    $json_response = json_decode($check_user, true);

    if ($json_response['msg'] == 'true') {
        $id = $json_response['id'];

        $data = json_decode(file_get_contents("php://input"));

        $name = $data->queue_name;
        $domain_id = $data->domain_id;
        $extension = $data->extension;
        $greeting = $data->greeting;
        $strategy = $data->strategy;
        $music_on_hold = $data->music_on_hold;
        $record = $data->record;
        $time_base_score = $data->time_base_score;
        $time_base_score_seconds = $data->time_base_score_seconds;
        $max_wait_time = $data->max_wait_time;
        $max_wait_time_no_agent = $data->max_wait_time_no_agent;
        $max_wait_time_no_agent_time_reach = $data->max_wait_time_no_agent_time_reach;
        $timeout_action = $data->timeout_action;
        $tier_rules_apply = $data->tier_rules_apply;
        $tier_rules_wait_second = $data->tier_rules_wait_second;
        $tier_rules_wait_multiply_level = $data->tier_rules_wait_multiply_level;
        $tier_rules_no_agent_no_wait = $data->tier_rules_no_agent_no_wait;
        $discard_abondoned_after = $data->discard_abondoned_after;
        $resume_allow = $data->resume_allow;
        $caller_id_name_prefix = $data->caller_id_name_prefix;
        $announce_sound = $data->announce_sound;
        $announce_frequency = $data->announce_frequency;
        $exit_key = $data->exit_key;
        $description = $data->description;

        $uuid = Uuid::uuid4();
        // Get the UUID as a string
        $uuidString = $uuid->toString();
        $call_center->post(
            $con,
            $uuidString,
            $domain_id,
            $name,
            $extension,
            $greeting,
            $strategy,
            $music_on_hold,
            $record,
            $time_base_score,
            $time_base_score_seconds,
            $max_wait_time,
            $max_wait_time_no_agent,
            $max_wait_time_no_agent_time_reach,
            $timeout_action,
            $tier_rules_apply,
            $tier_rules_wait_second,
            $tier_rules_wait_multiply_level,
            $tier_rules_no_agent_no_wait,
            $discard_abondoned_after,
            $resume_allow,
            $caller_id_name_prefix,
            $announce_sound,
            $announce_frequency,
            $exit_key,
            $description,
            $id
        );
        
    } else {
        header('WWW-Authenticate: Basic realm="My Realm"');
        header('HTTP/1.0 401 Unauthorized');
        echo json_encode([
            "message" => "Authentication Failed !!"
        ]);
        exit;
    
    }
?>