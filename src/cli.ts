#!/usr/bin/env node

import { Command } from 'commander';
import { existsSync } from 'fs';
import { join } from 'path';
import { fileURLToPath } from 'url';
import { dirname } from 'path';
import { spawn } from 'child_process';
import { rm } from 'fs/promises';

// Get the package root directory
const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);
const packageRoot = join(__dirname, '..');

const program = new Command();

program
  .name('@thatkid02/pixel-text')
  .description('CLI tool for pixel-text library')
  .version('0.0.4');

program
  .command('run')
  .description('Run pixel-text examples')
  .argument('[type]', 'Type of example to run (e.g., "example")', 'example')
  .action(async (type: string) => {
    if (type !== 'example') {
      console.error('Currently only "example" type is supported');
      process.exit(1);
    }

    const exampleDir = join(packageRoot, 'examples/react');
    
    if (!existsSync(exampleDir)) {
      console.error('Example directory not found. Please check your installation.');
      process.exit(1);
    }

    console.log('📦 Installing dependencies...');
    
    // Run npm install in the example directory
    const install = spawn('npm', ['install'], {
      cwd: exampleDir,
      stdio: 'inherit',
      shell: true
    });

    install.on('close', (code) => {
      if (code !== 0) {
        console.error('Failed to install dependencies');
        process.exit(1);
      }

      console.log('🚀 Starting the example...');
      
      // Run npm run dev in the example directory
      const dev = spawn('npm', ['run', 'dev'], {
        cwd: exampleDir,
        stdio: 'inherit',
        shell: true
      });

      dev.on('error', (error) => {
        console.error('Failed to start the example:', error);
        process.exit(1);
      });
    });
  });

program
  .command('clean')
  .description('Clean example project files')
  .argument('[type]', 'Type of example to clean (e.g., "example")', 'example')
  .action(async (type: string) => {
    if (type !== 'example') {
      console.error('Currently only "example" type is supported');
      process.exit(1);
    }

    const exampleDir = join(packageRoot, 'examples/react');
    
    if (!existsSync(exampleDir)) {
      console.error('Example directory not found. Please check your installation.');
      process.exit(1);
    }

    try {
      console.log('🧹 Cleaning example project...');
      
      // Clean directories
      const dirsToClean = [
        join(exampleDir, 'node_modules'),
        join(exampleDir, 'dist')
      ];

      for (const dir of dirsToClean) {
        if (existsSync(dir)) {
          await rm(dir, { recursive: true, force: true });
        }
      }

      // Clean files
      const filesToClean = [
        join(exampleDir, 'package-lock.json')
      ];

      for (const file of filesToClean) {
        if (existsSync(file)) {
          await rm(file);
        }
      }

      console.log('✨ Example project cleaned successfully!');
    } catch (error) {
      console.error('Failed to clean example project:', error);
      process.exit(1);
    }
  });

program.parse();