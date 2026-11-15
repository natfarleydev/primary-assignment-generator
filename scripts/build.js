// Build one self-contained dist/index.html: CSS, JS and fonts inlined, so the
// page works from file:// and on GitHub Pages with no network.

import { build } from 'esbuild';
import { readFileSync, writeFileSync, mkdirSync } from 'node:fs';

const root = new URL('../', import.meta.url);
const read = (path) => readFileSync(new URL(path, root));

const { outputFiles } = await build({
  entryPoints: [new URL('src/main.js', root).pathname],
  bundle: true, format: 'iife', minify: true, write: false, target: 'es2020',
});
const script = outputFiles[0].text.replace(/<\/script/gi, '<\\/script');

const styles = read('src/styles.css').toString().replace(
  /url\(fonts\/([^)]+)\)/g,
  (_, file) => `url(data:font/woff2;base64,${read(`src/fonts/${file}`).toString('base64')})`,
);

const html = read('src/index.html').toString()
  .replace('/*STYLES*/', () => styles)
  .replace('/*SCRIPT*/', () => script);

mkdirSync(new URL('dist/', root), { recursive: true });
writeFileSync(new URL('dist/index.html', root), html);
console.log(`dist/index.html (${Math.round(html.length / 1024)} KB)`);
