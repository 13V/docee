import { cp, mkdir, readdir, rm } from 'node:fs/promises';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const output = path.join(root, 'dist');

// Only replace this project's generated output directory.
if (path.relative(root, output) !== 'dist') throw new Error('Invalid build output path');
await rm(output, { recursive: true, force: true });
await mkdir(output, { recursive: true });

const files = [
  'index.html',
  'sketches.js',
  'app.js',
  'docee-reference.css',
  'activity-polished.css',
  'docee-polish.css',
  'mobile-browser.css',
  'docee-sketch.css',
  'docee-delight.css',
  'delight.js',
  'public',
  'docs',
];

for (const file of files) {
  await cp(path.join(root, file), path.join(output, file), { recursive: true });
}

const builtFiles = await readdir(output, { recursive: true, withFileTypes: true });
console.log(`Built ${builtFiles.filter(file => file.isFile()).length} static files in dist/`);
