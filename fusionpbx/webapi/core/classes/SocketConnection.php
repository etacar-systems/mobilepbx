<?php
require("EventSocket.php");

class SocketConnection
{
	
  	public static function _event_socket_create()
    {   
        $host = '127.0.0.1';
        $password = '5NOiMPw6S7ei';
        $port = '8021';

        try {
            $esl = new EventSocket;
            if ($esl->connect($host, $port, $password)) {
                return $esl->reset_fp();
            }else{
                return false;
            }    
        } catch (Exception $e) {
            return false;    
        }        
        
    }

    public static function _event_socket_request($fp, $cmd) 
    {
        try {
            $esl = new EventSocket($fp);
            $result = $esl->request($cmd);
            $esl->reset_fp();
            return $result;
        }  catch (Exception $e) {
            return false;    
        }   
    }


    public static function cache_delete($key){

            
        $method = 'file';
    
        $syslog = 'false';
    
        $location = '/var/cache/fusionpbx';
        

        //change the delimiter
        $key = str_replace(":", ".", $key);

        $fp = SocketConnection::_event_socket_create();

        $event = "sendevent CUSTOM\n";
        $event .= "Event-Name: CUSTOM\n";
        $event .= "Event-Subclass: fusion::file\n";
        $event .= "API-Command: cache\n";
        $event .= "API-Command-Argument: delete ".$key."\n";

        $json = SocketConnection::_event_socket_request($fp, $event);

    //remove the local files
        foreach (glob($location . "/" . $key) as $file) {
            if (file_exists($file)) {
                unlink($file);
            }
            if (file_exists($file)) {
                unlink($file . ".tmp");
            }
        }
    }

	
}
