#!/usr/bin/env node

import { exec } from 'child_process';
import { createRequire } from 'module';
import * as url from 'url';
import * as path from 'path';

const __dirname = url.fileURLToPath(new URL('.', import.meta.url));
const require = createRequire(import.meta.url);

console.log('Initializing database...');

// Run drizzle-kit push with yes pipe for auto-confirmation
exec('echo "yes" | npx drizzle-kit push', { cwd: path.resolve(__dirname, '..') }, (error, stdout, stderr) => {
  if (error) {
    console.error(`Error: ${error.message}`);
    return;
  }
  
  if (stderr) {
    console.error(`stderr: ${stderr}`);
    return;
  }
  
  console.log(`Database schema pushed successfully: ${stdout}`);
  
  // Optional: Add admin user or initial data
  console.log('Database initialization completed');
});