<?php
    $output = shell_exec('fs_cli -x "sofia status profile internal reg"'); 
  
$data = $output;
// Explode the data into registrations
$registrations = explode("\n\n", $data);

array_pop($registrations);

// Initialize an empty array to store the JSON data
$json_data = array();

// Loop through each registration
foreach ($registrations as $registration) {
    // Explode each registration into lines
    $lines = explode("\n", $registration);

    // Initialize an empty array to store the registration data
    $registration_data = array();

    // Loop through each line
    foreach ($lines as $line) {
        // Split each line into key-value pairs
        list($key, $value) = explode(":", $line, 2);
        $key = trim($key);
        $value = trim($value);
        $registration_data[$key] = $value;
    }

unset($registration_data['']);
unset($registration_data['Registrations']);
unset($registration_data['=================================================================================================']);

    // Add the registration data to the JSON array
    $json_data[] = $registration_data;
}

// Convert the array to JSON format
$json_output = json_encode($json_data, JSON_PRETTY_PRINT);


echo "<pre>";
echo $json_output;
echo "</pre>";
?>
