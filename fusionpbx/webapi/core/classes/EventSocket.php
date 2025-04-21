<?php

require("Buffer.php");

/**
 * LoginForm class.
 * LoginForm is the data structure for keeping
 * user login form data. It is used by the 'login' action of 'SiteController'.
 */
class EventSocket
{

	private $buffer;
	private $fp;

	public function __construct($fp = false) {
		$this->buffer = new Buffer;
		$this->fp = $fp;
	}

	public function __destructor() {
		$this->close();
	}

	public function read_event() {
		if (!$this->fp) {
			return false;
		}

		$b = $this->buffer;
		$content_length = 0;
		$content = Array();

		while (true) {
			while(($line = $b->read_line()) !== false ) {
				if ($line == '') {
					break 2;
				}
				$kv = explode(':', $line, 2);
				$content[trim($kv[0])] = trim($kv[1]);
			}
			usleep(100);

			if (feof($this->fp)) {
				break;
			}

			$buffer = fgets($this->fp, 1024);
			$b->append($buffer);
		}

		if (array_key_exists('Content-Length', $content)) {
			$str = $b->read_n($content['Content-Length']);
			if ($str === false) {
				while (!feof($this->fp)) {
					$buffer = fgets($this->fp, 1024);
					$b->append($buffer);
					$str = $b->read_n($content['Content-Length']);
					if ($str !== false) {
						break;
					}
				}
			}
			if ($str !== false) {
				$content['$'] = $str;
			}
		}

		return $content;
	}

	public function connect($host, $port, $password) {
		//set defaults
		if ($host == '') { $host = '127.0.0.1'; }
		if ($port == '') { $port = '8021'; }
		if ($password == '') { $password = 'ClueCon'; }

		try {
			$fp = fsockopen($host, $port, $errno, $errdesc, 3);	
		} catch (Exception $e) {
			$fp = false;
		}
		

		if (!$fp) {
			return false;
		}

		socket_set_blocking($fp, false);
		$this->fp = $fp;

		// Wait auth request and send response
			while (!feof($fp)) {
				$event = $this->read_event();
				if(@$event['Content-Type'] == 'auth/request'){
					fputs($fp, "auth $password\n\n");
					break;
				}
			}

		// Wait auth response
			while (!feof($fp)) {
				$event = $this->read_event();
				if (@$event['Content-Type'] == 'command/reply') {
					if (@$event['Reply-Text'] == '+OK accepted') {
						return $fp;
					}
					$this->fp = false;
					fclose($fp);
					return false;
				}
			}

		return false;
	}

	public function request($cmd) {
		if (!$this->fp) {
			return false;
		}

		$cmd_array = explode("\n", $cmd);
		foreach ($cmd_array as &$value) {
			fputs($this->fp, $value."\n");
		}
		fputs($this->fp, "\n"); //second line feed to end the headers

		$event = $this->read_event();

		if (array_key_exists('$', $event)) {
			return $event['$'];
		}
		return $event;
	}


	public function reset_fp($fp = false){
		$tmp = $this->fp;
		$this->fp = $fp;
		return $tmp;
	}

	public function close() {
		if ($this->fp) {
			fclose($this->fp);
			$this->fp = false;
		}
	}




}