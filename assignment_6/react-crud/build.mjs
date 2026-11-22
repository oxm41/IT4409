import { build } from 'esbuild';
import { mkdir, copyFile } from 'node:fs/promises';
await mkdir('dist/assets', { recursive: true });
await build({
  entryPoints: ['src/main.jsx'],
  outfile: 'dist/assets/app.js',
  bundle: true,
  minify: true,
  jsx: 'automatic',
  define: { 'process.env.NODE_ENV': '"production"' },
  target: ['es2020']
});
await copyFile('index.html', 'dist/index.html');
await copyFile('src/styles.css', 'dist/assets/styles.css');
console.log('React CRUD built in dist/');
