#!/usr/bin/env node
/**
 * Post-build script: injects <link rel="modulepreload"> hints for the main
 * JS entry chunk and its direct imports into the built index.html. This tells
 * the browser to start downloading and parsing the JavaScript as early as
 * possible, shaving seconds off interactive time for SPAs.
 */
import { readFileSync, writeFileSync, readdirSync } from 'node:fs';
import { join } from 'node:path';

const DIST = join(import.meta.dirname, '..', 'dist', 'public');
const indexPath = join(DIST, 'index.html');
const assetsDir = join(DIST, 'assets');

// Find the main entry chunk (index-*.js) and the CSS chunk
const assets = readdirSync(assetsDir);
const mainJs = assets.find(f => f.startsWith('index-') && f.endsWith('.js'));
const mainCss = assets.find(f => f.startsWith('index-') && f.endsWith('.css'));

if (!mainJs) {
  console.error('Could not find main JS chunk in dist/public/assets/');
  process.exit(1);
}

let html = readFileSync(indexPath, 'utf8');

// Build preload hints
const hints = [];
hints.push(`<link rel="modulepreload" href="/assets/${mainJs}" />`);

// Also preload the Home chunk since it's the landing page
const homeJs = assets.find(f => f.startsWith('Home-') && f.endsWith('.js'));
if (homeJs) {
  hints.push(`<link rel="modulepreload" href="/assets/${homeJs}" />`);
}

// Inject right before closing </head>
const marker = '</head>';
html = html.replace(marker, `    ${hints.join('\n    ')}\n  ${marker}`);

writeFileSync(indexPath, html);

console.log(`✓ Injected modulepreload hints:`);
hints.forEach(h => console.log(`  ${h}`));
if (mainCss) console.log(`  CSS: /assets/${mainCss} (already linked by Vite)`);
