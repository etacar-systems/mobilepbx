const { exec } = require('child_process');
const path = require('path');
const scriptPath = path.join(__dirname, 'execute_socket.php');

const fs_command = (cmd: any): Promise<any> => {
  const command = `/usr/bin/php ${scriptPath} "${encodeURIComponent(cmd)}"`;

  return new Promise((resolve, reject) => {
    exec(command, (error:any, stdout:any, stderr:any) => {
      if (error) {
        console.error(`Error executing PHP: ${error.message}`);
        reject(error);
        return;
      }

      if (stderr) {
        console.error(`PHP stderr: ${stderr}`);
        reject(stderr);
        return;
      }

      try {
        const response = stdout;
        resolve(response);
      } catch (parseError) {
        console.error("Failed to parse JSON:", parseError);
        console.error("Raw PHP output:", stdout);
        reject(parseError);
      }
    });
  });
};

export default fs_command;