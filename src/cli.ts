#!/usr/bin/env node

import { Command } from 'commander';
import { existsSync } from 'fs';
import { join } from 'path';
import { fileURLToPath } from 'url';
import { dirname } from 'path';
import { createServer, IncomingMessage, ServerResponse } from 'http';
import { readFile } from 'fs/promises';
import readline from 'readline';

// Get the package root directory
const __filename: string = fileURLToPath(import.meta.url);
const __dirname: string = dirname(__filename);
const packageRoot: string = join(__dirname, '..');

const program = new Command();

program
  .name('@thatkid02/pixel-text')
  .description('CLI tool for pixel-text library')
  .version('0.0.4');

function askQuestion(query: string): Promise<string> {
  const rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout,
  });

  return new Promise((resolve) => rl.question(query, (answer: string) => {
    rl.close();
    resolve(answer);
  }));
}

program
  .command('run')
  .description('Run pixel-text examples')
  .action(async () => {
    const options: string[] = ['example', 'random', 'vanilla-js'];
    console.log('Select the type of example to run:');
    options.forEach((opt, index) => console.log(`${index + 1}. ${opt}`));

    const choice: string = await askQuestion('Enter your choice[1-3]: ');
    const selectedIndex: number = parseInt(choice) - 1;
    const type: string | undefined = options[selectedIndex];
    
    if (!type) {
      console.error('Invalid selection. Exiting.');
      process.exit(1);
    }

    const distDir: string = join(packageRoot, `examples/${type}`);
    
    if (!existsSync(distDir)) {
      console.error(`${type} directory not found. Please check your installation.`);
      process.exit(1);
    }

    const port: number = 3000;
    const server = createServer(async (req: IncomingMessage, res: ServerResponse) => {
      try {
        let filePath: string = join(distDir, req.url === '/' ? 'index.html' : req.url || '');
        
        // Handle 404 by serving index.html (for SPA routing)
        if (!existsSync(filePath)) {
          filePath = join(distDir, 'index.html');
        }

        const content: Buffer = await readFile(filePath);
        const ext: string | undefined = filePath.split('.').pop();
        
        // Basic content-type mapping
        const contentTypes: Record<string, string> = {
          html: 'text/html',
          js: 'text/javascript',
          css: 'text/css',
          png: 'image/png',
          jpg: 'image/jpeg',
          svg: 'image/svg+xml',
        };

        res.setHeader('Content-Type', contentTypes[ext || ''] || 'text/plain');
        res.end(content);
      } catch (error) {
        res.statusCode = 500;
        res.end('Internal Server Error');
      }
    });

    server.listen(port, () => {
      console.log(`🚀 ${type} running at http://localhost:${port}`);
    });
  });

program.parse();