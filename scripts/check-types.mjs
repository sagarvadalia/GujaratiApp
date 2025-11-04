#!/usr/bin/env node

import { spawn } from 'node:child_process';
import process from 'node:process';

const tasks = [
  { name: 'frontend', args: ['--filter', 'frontend', 'run', 'typecheck'] },
  { name: 'server', args: ['--filter', 'server', 'run', 'typecheck'] }
];

const isWindows = process.platform === 'win32';

async function runSequentially() {
  for (const task of tasks) {
    console.log(`\n▶️  Running typecheck for ${task.name}...`);
    await execute('pnpm', task.args, task.name);
  }
  console.log('\n✅ Type checks passed for all packages');
}

function execute(command, args, name) {
  return new Promise((resolve, reject) => {
    const child = spawn(command, args, {
      stdio: 'inherit',
      shell: isWindows
    });

    child.on('exit', (code) => {
      if (code === 0) {
        resolve();
      } else {
        reject(new Error(`Typecheck failed for ${name} (exit code ${code})`));
      }
    });

    child.on('error', (error) => {
      reject(error);
    });
  });
}

runSequentially().catch((error) => {
  console.error(`\n❌ ${error.message}`);
  process.exit(1);
});



