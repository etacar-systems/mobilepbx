<?php

require("../classes/SocketConnection.php");

	
                $fp = SocketConnection::_event_socket_create();
                $json = SocketConnection::_event_socket_request($fp, "api show calls as json");
                //$json = SocketConnection::_event_socket_request($fp, "api version");

               // $json = SocketConnection::_event_socket_request($fp, "api show registrations as json");

               // $json = SocketConnection::_event_socket_request($fp, "api sofia status profile internal reg | grep 'Auth-User:' | awk '{print $2}'");

		echo "DATA :::"; 
		print_r($json);
?>
