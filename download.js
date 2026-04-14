import fs from 'fs';
import https from 'https';

const url = "https://lh3.googleusercontent.com/aida/ADBb0ujmmV-H_K9pgTUdPPN0koPo8v-eN4uCBjvDBOonwpBUcpG9m3CXcojb-6YkEKcfyHLNgQ8G5u3CGdAD_De6cU3iTAvJ1YYjKwelYQt5qQhRYGYjsXMrr_vvCi8_dAedhV-Wtkm_GCmawLIGJq0jVBRVNOr40LHmScjykioeEfB1NEdvE_TpoUImCCtw3WJj3RRWVncJnugkFn5zmq0d049fGl9L9gUohE5YjzEQEKLRsiXZk_QWnXrACCE";

const file = fs.createWriteStream("stitch_login.png");
https.get(url, function(response) {
  response.pipe(file);
  file.on("finish", () => {
      file.close();
      console.log("Download complete");
  });
}).on("error", (err) => {
  fs.unlink("stitch_login.png", () => {});
  console.error("Error downloading:", err.message);
});
