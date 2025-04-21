<?php
    require_once __DIR__ . '/../vendor/autoload.php';

    // $dotenv = Dotenv\Dotenv::createImmutable(__DIR__ . "./../");
    // $dotenv->load();

    // if ($_ENV['DEBUG'] == true) {
     //    ini_set('display_errors', 1);
      //   ini_set('display_startup_errors', 1);
      //   error_reporting(E_ALL);
    // }

    // $dbhost = $_ENV['DB_HOST'];
    // $dbuser = $_ENV['DB_USERNAME'];
    // $dbpass = $_ENV['DB_PASSWORD'];
    // $dbname = $_ENV['DB_DATABASE'];
    // $port = $_ENV['DB_PORT'];

  // TODO: move to env
    $dbhost = '127.0.0.1';
    $dbuser = 'fusionpbx';
    $dbpass = '5jiMBfspa5N9fm1LODjLl1doK94';
    $dbname = 'fusionpbx';
    $port = 5432;

    $con = pg_connect("host=$dbhost port=$port dbname=$dbname user=$dbuser password=$dbpass")
    or die('Could not connect: ' . pg_last_error());
	
?>
