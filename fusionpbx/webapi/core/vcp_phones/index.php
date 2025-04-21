<?php
    //headers
    header('Access-Control-Allow-Origin: *');
    header('Content-Type: application/json');
    header('Access-Control-Allow-Methods: POST');
    header('Access-Control-Allow-Headers: Access-Control-Allow-Headers,Content-Type,Access-Control-Allow-Methods,Authorization,');

    require("../../config/config.php");
    require("../../vendor/autoload.php");
    
    use Ramsey\Uuid\Uuid;

    require("vcp_phone.php");

    $vcp_phone = new Vcp_phone();

    if (!isset($_SERVER['PHP_AUTH_USER']) || !isset($_SERVER['PHP_AUTH_PW'])){
        echo json_encode([
            "message" => "Authentication Failed !!"
        ]);
        return;
    } else {
        $username = $_SERVER['PHP_AUTH_USER'];
        $password = $_SERVER['PHP_AUTH_PW'];
    }

    $check_user = $vcp_phone->verify_user($con, $username, $password);
    $json_response = json_decode($check_user, true);

    if ($json_response['msg'] == 'true') {
        $id = $json_response['id'];
        if ($_SERVER['REQUEST_METHOD'] === 'POST') {

            $domain_name = $_POST['domain'];
            $extension = $_POST['extension'];
            $password = $_POST['password'];

            if (empty($domain_name)) {
                echo json_encode([
                    'msg' => 'Domain Name is Required',
                ]);
                return;  
            }

            elseif (empty($extension)) {
                echo json_encode([
                    'msg' => 'Extension is Required',
                ]);
                return;
            }

            elseif (empty($password)) {
                echo json_encode([
                    'msg' => 'Password is Required',
                ]);
                return;
            }

            // Create a new SimpleXMLElement object
            $config = new SimpleXMLElement('<?xml version="1.0" encoding="UTF-8"?><config xmlns="http://www.linphone.org/xsds/lpconfig.xsd" xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance" xsi:schemaLocation="http://www.linphone.org/xsds/lpconfig.xsd lpconfig.xsd"></config>');

            // Add sections and entries
            $sipSection = $config->addChild('section');
            $sipSection->addAttribute('name', 'sip');
            $sipSection->addChild('entry', '0')->addAttribute('name', 'default_proxy', null);

            $miscSection = $config->addChild('section');
            $miscSection->addAttribute('name', 'misc');
            $miscSection->addChild('entry', '1')->addAttribute('name', 'transient_provisioning', null);

            $authInfoSection = $config->addChild('section');
            $authInfoSection->addAttribute('name', 'auth_info_0');
            $authInfoSection->addChild('entry', $extension)->addAttribute('name', 'username', null);
            $authInfoSection->addChild('entry', $password)->addAttribute('name', 'passwd', null);
            $authInfoSection->addChild('entry', $domain_name)->addAttribute('name', 'realm', null);
            $authInfoSection->addChild('entry', $domain_name)->addAttribute('name', 'domain', null);
            $authInfoSection->addChild('entry', '')->addAttribute('name', 'algorithm', null);

            $proxySection = $config->addChild('section');
            $proxySection->addAttribute('name', 'proxy_0');
            $proxySection->addChild('entry', '<sip:'.$domain_name.';transport=udp>', null)->addAttribute('name', 'reg_proxy', null);
            $proxySection->addChild('entry', ''.$extension.'<sip:'.$extension.'@'.$domain_name.'>', null)->addAttribute('name', 'reg_identity', null);
            $proxySection->addChild('entry', $domain_name)->addAttribute('name', 'realm', null);
            $proxySection->addChild('entry', 'sip:'.$extension.'@'.$domain_name.';transport=udp')->addAttribute('name', 'quality_reporting_collector', null);
            $proxySection->addChild('entry', '0')->addAttribute('name', 'quality_reporting_enabled', null);
            $proxySection->addChild('entry', '180')->addAttribute('name', 'quality_reporting_interval', null);
            $proxySection->addChild('entry', '3600')->addAttribute('name', 'reg_expires', null);
            $proxySection->addChild('entry', '1')->addAttribute('name', 'reg_sendregister', null);

            // Format the XML for better readability
            $dom = dom_import_simplexml($config)->ownerDocument;
            $dom->formatOutput = true;

            highlight_string($dom->saveXML());
            // $arr[] = $row;
            // echo json_encode($arr);

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

