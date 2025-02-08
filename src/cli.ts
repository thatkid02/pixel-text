#!/usr/bin/env node

import { Command } from 'commander';
import { existsSync } from 'fs';
import { join } from 'path';
import { fileURLToPath } from 'url';
import { dirname } from 'path';
import { createServer } from 'http';
import { readFile } from 'fs/promises';

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

    const exampleDistDir = join(packageRoot, 'examples/react/dist');
    
    if (!existsSync(exampleDistDir)) {
      console.error('Example dist directory not found. Please check your installation.');
      process.exit(1);
    }

    const port = 3000;
    const server = createServer(async (req, res) => {
      try {
        let filePath = join(exampleDistDir, req.url === '/' ? 'index.html' : req.url || '');
        
        // Handle 404 by serving index.html (for SPA routing)
        if (!existsSync(filePath)) {
          filePath = join(exampleDistDir, 'index.html');
        }

        const content = await readFile(filePath);
        const ext = filePath.split('.').pop();
        
        // Basic content-type mapping
        const contentTypes: Record<string, string> = {
          'html': 'text/html',
          'js': 'text/javascript',
          'css': 'text/css',
          'png': 'image/png',
          'jpg': 'image/jpeg',
          'svg': 'image/svg+xml',
        };

        res.setHeader('Content-Type', contentTypes[ext || ''] || 'text/plain');
        res.end(content);
      } catch (error) {
        res.statusCode = 500;
        res.end('Internal Server Error');
      }
    });

    server.listen(port, () => {
      console.log(`🚀 Example running at http://localhost:${port}`);
    });
  });

program.parse();