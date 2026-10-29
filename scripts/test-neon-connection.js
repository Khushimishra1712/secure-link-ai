const net = require("node:net");

const host = "ep-square-silence-b7c2zp0t-pooler.c-13.us-east-1.aws.neon.tech";
const port = 5432;
const timeoutMs = 5000;

const socket = net.createConnection({ host, port });
let finished = false;

const timeout = setTimeout(() => {
  finish(`Timed out connecting to ${host}:${port} after ${timeoutMs} ms.`, false);
}, timeoutMs);

function finish(message, success) {
  if (finished) return;
  finished = true;
  clearTimeout(timeout);
  (success ? console.log : console.error)(message);
  if (success) {
    socket.end();
  } else {
    socket.destroy();
    process.exitCode = 1;
  }
}

socket.once("connect", () => {
  finish(`TCP connection to ${host}:${port} succeeded.`, true);
});

socket.once("error", (error) => {
  finish(`TCP connection to ${host}:${port} failed (${error.code ?? error.message}).`, false);
});
