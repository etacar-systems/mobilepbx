<?php
    $output = shell_exec('fs_cli -x "sofia status profile internal reg"'); 
  
    echo "<pre>$output</pre>"; 
?>
