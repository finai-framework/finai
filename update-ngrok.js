const fs = require('fs');
const { spawn, exec } = require('child_process');
const process = require('process');
require('dotenv').config();

console.log('Starting ngrok for frontend...');

// get port from environment variable or default to 3002
const port = process.env.PORT || 3002;

// Chạy ngrok cho frontend với tùy chọn ghi log ra stdout
const ngrok = spawn('ngrok', ['http', port, '--log=stdout']);

ngrok.stdout.on('data', (data) => {
  const output = data.toString();
  console.log(output); // Ghi dữ liệu để kiểm tra

  // Tìm URL ngrok từ log
  const match = output.match(/https:\/\/[a-z0-9-]+\.ngrok-free\.app/);
  if (match) {
    const frontendUrl = match[0];

    const contentJs = `
const NGROK_FRONTEND = "${frontendUrl}";

export { NGROK_FRONTEND };
    `;

    const contentTs = `
export let NGROK_FRONTEND = "${frontendUrl}";
    `;
    try {
      fs.writeFileSync('src/domain.ts', contentTs, 'utf8');
      fs.writeFileSync('bot_ui/src/domain.js', contentJs, 'utf8');
      const excApp = spawn('npm', ['run', 'build-client-server', '--log=stdout']);
      excApp.stdout.on('data', (data) => {
        const output = data.toString();
        console.log(output); // Ghi dữ liệu để kiểm tra
      })
      console.log(`running ${frontendUrl} => http://localhost:${port}`);
    } catch (e) {
      console.log(e)
      exec("pkill ngrok")
    }
  }
});

ngrok.stderr.on('data', (data) => {
  console.error(`ngrok error: ${data.toString()}`);
});

ngrok.on('close', (code) => {
  console.log(`ngrok process exited with code ${code}`);
});
