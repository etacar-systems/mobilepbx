<?php
require("SocketConnection.php");

$command = isset($argv[1]) ? urldecode($argv[1]) : "api show registrations as json";
$fp = SocketConnection::_event_socket_create();
$json = SocketConnection::_event_socket_request($fp, $command);

$response = $json;

// Output the response as JSON
echo json_encode($response);
?>
