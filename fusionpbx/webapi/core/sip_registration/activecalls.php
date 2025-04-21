<?php

// Execute the command and capture the output
$data = shell_exec('fs_cli -x "show calls"');

$lines = explode("\n", $data);

array_pop($lines);
array_pop($lines);
array_pop($lines);
array_pop($lines);

// Extract the header fields
$headers = str_getcsv($lines[0]);

// Initialize an empty array to store the JSON data
$json_data = array();

// Loop through each line (excluding the header)
for ($i = 1; $i < count($lines); $i++) {
    // Extract values for each line
    $values = str_getcsv($lines[$i]);

    // Initialize an empty array to store the current line's data
    $line_data = array();

    // Loop through each header field and assign corresponding value
    for ($j = 0; $j < count($headers); $j++) {
        $line_data[$headers[$j]] = $values[$j];
    }

    // Add the line's data to the JSON data array
    $json_data[] = $line_data;
}

// Convert the array to JSON format
$json_output = json_encode($json_data, JSON_PRETTY_PRINT);

// Output the JSON data

echo "<pre>";
echo $json_output;
echo "</pre>";
?>
