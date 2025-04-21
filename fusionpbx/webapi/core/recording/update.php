<?php
    //headers
    header('Access-Control-Allow-Origin: *');
    header('Content-Type: application/json');
    header('Access-Control-Allow-Methods: POST');
    header('Access-Control-Allow-Headers: Access-Control-Allow-Headers,Content-Type,Access-Control-Allow-Methods,Authorization,');

    require("../../config/config.php");
    require("../../vendor/autoload.php");
    
    use Ramsey\Uuid\Uuid;

    require("recording.php");

    $recording = new Recording();

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
        $id = $json_response['id'];
        if ($_SERVER['REQUEST_METHOD'] === 'POST') {

            $domain_name = $_POST['domain'];
            $name = $_POST['name'];
            $description = $_POST['description'];

            $fileName = '';
            if(isset($_FILES['file']) && !empty($_FILES['file']['name'])){
                $fileName = $_FILES['file']['name'];
            }
            $recording_id = $_POST['recording_id'];

            $fetchDomain = "SELECT * FROM public.v_domains WHERE domain_uuid = '$domain_name'";
            $result = pg_query($con, $fetchDomain);
            if (pg_num_rows($result) > 0) {
                $userID = $id;
                $rowDomain = pg_fetch_assoc($result);

                if(strlen($fileName) > 0){
                    $target_dir = "../../../../../lib/freeswitch/recordings/".$rowDomain['domain_name']."/";
                    $target_file = $target_dir.basename(($_FILES['file']['name']));

                    $target_dir_second = "../../../ext_storage/recordings/".$rowDomain['domain_name']."/";
                    $target_file_second = $target_dir_second.basename(($_FILES['file']['name']));

                
                    move_uploaded_file($_FILES['file']['tmp_name'], $target_file);
                    shell_exec('cp '.$target_file.' '.$target_dir_second);
                }
                
                    
                $recording->update($con, $domain_name, $name, $fileName, $description, $recording_id, $id,$rowDomain['domain_name']);
                
            } else {
                echo json_encode([
                    "message" => "Domain Doesnot Exists !!"
                ]);
                return;
            }
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
