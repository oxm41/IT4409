import { execFileSync } from 'node:child_process';
import { copyFile, cp, mkdir, rm, writeFile } from 'node:fs/promises';
import { dirname, resolve, sep } from 'node:path';

const output = resolve('.checks/pages');
if (!output.startsWith(resolve('.checks') + sep)) throw new Error('Invalid staging directory');
await rm(output, { recursive: true, force: true });
await mkdir(output, { recursive: true });

// Only publish files tracked in Git; local exercises and tooling stay local.
const files = execFileSync('git', ['ls-files', '-z', '--', 'public'], { encoding: 'utf8' })
  .split('\0').filter(Boolean);
if (!files.includes('public/index_new.html')) throw new Error('Missing semantic home page');
for (const file of files) {
  const target = resolve(output, file.slice('public/'.length));
  if (!target.startsWith(output + sep)) throw new Error('Invalid output path');
  await mkdir(dirname(target), { recursive: true });
  await copyFile(file, target);
}

// React is bundled separately; the report is copied from tracked public files above.
await cp(resolve('assignment_6/react-crud/dist'), resolve(output, 'assignment_6'), { recursive: true });

// Pages serves index.html for /. Keep the original template for comparison.
await copyFile(resolve('public/index.html'), resolve(output, 'index_original.html'));
await writeFile(resolve(output, 'index.html'), `<!doctype html>
<html lang="vi">
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1">
  <meta http-equiv="refresh" content="0; url=index_new.html">
  <link rel="canonical" href="https://oxm41.github.io/IT4409/index_new.html">
  <title>Blakletterpress</title>
</head>
<body>
  <a href="index_new.html">Mở trang chủ Blakletterpress</a>
  <script>location.replace(new URL('index_new.html' + location.search + location.hash, location.href));</script>
</body>
</html>
`);
await writeFile(resolve(output, '.nojekyll'), '');
console.log(`Prepared ${files.length} tracked files for https://oxm41.github.io/IT4409/`);
