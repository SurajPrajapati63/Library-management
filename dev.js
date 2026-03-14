const { spawn } = require('child_process');

function run(command, args, label, color) {
  const child = spawn(command, args, { stdio: 'pipe', shell: true });

  child.stdout.on('data', (chunk) => {
    process.stdout.write(`\x1b[${color}m[${label}]\x1b[0m ${chunk}`);
  });

  child.stderr.on('data', (chunk) => {
    process.stderr.write(`\x1b[${color}m[${label}]\x1b[0m ${chunk}`);
  });

  child.on('exit', (code) => {
    console.log(`[${label}] exited with code ${code}`);
  });

  return child;
}

const server = run('npm', ['--prefix', 'server', 'run', 'dev'], 'server', '36');
const client = run('npm', ['--prefix', 'client', 'start'], 'client', '35');

function shutdown() {
  server.kill();
  client.kill();
  process.exit(0);
}

process.on('SIGINT', shutdown);
process.on('SIGTERM', shutdown);
