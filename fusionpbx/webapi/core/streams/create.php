<?php
    //headers
    header('Access-Control-Allow-Origin: *');
    header('Content-Type: application/json');
    header('Access-Control-Allow-Methods: POST');
    header('Access-Control-Allow-Headers: Access-Control-Allow-Headers,Content-Type,Access-Control-Allow-Methods,Authorization,');

    require("../../config/config.php");
    require("../../vendor/autoload.php");
    
    use Ramsey\Uuid\Uuid;

    require("stream.php");

    $stream = new Stream();

    if (!isset($_SERVER['PHP_AUTH_USER']) || !isset($_SERVER['PHP_AUTH_PW'])){
        echo json_encode([
            "message" => "Authentication Failed !!"
        ]);
        return;
    } else {
        $username = $_SERVER['PHP_AUTH_USER'];
        $password = $_SERVER['PHP_AUTH_PW'];
    }

    $check_user = $stream->verify_user($con, $username, $password);
    $json_response = json_decode($check_user, true);

    if ($json_response['msg'] == 'true') {
        $id = $json_response['id'];
        $data = json_decode(file_get_contents("php://input"));

        $domain_name = $data->domain;
        $name = $data->name;
        $location = $data->location;
        $description = $data->description;
        $stream_enabled = $data->stream_enabled;

        $uuid = Uuid::uuid4();
        // Get the UUID as a string
        $uuidStream = $uuid->toString();

        if ($stream_enabled == "true" || $stream_enabled == "false") {
            $stream->post($con, $name, $domain_name, $location, $description, $stream_enabled, $uuidStream, $id);
        } else {
            echo json_encode([
                "message" => "Stream Enabled Value Must be either True or False !!"
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