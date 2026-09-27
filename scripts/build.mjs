import { cp, mkdir, readdir, rm, lstat } from 'node:fs/promises';
import { resolve, relative, sep } from 'node:path';

const project = process.cwd();
const source = resolve(project, 'baitapHTML');
const destination = resolve(project, 'public');
// Chỉ xóa output public của project; không thao tác lên source hoặc archive.
if (destination !== resolve(project, 'public') || relative(project, destination) !== 'public' || source === destination) {
  throw new Error('Invalid output directory');
}
try {
  if ((await lstat(destination)).isSymbolicLink()) throw new Error('Output must not be a symlink');
} catch (error) {
  if (error.code !== 'ENOENT') throw error;
}
await rm(destination, { recursive: true, force: true });
await mkdir(destination, { recursive: true });
for (const entry of await readdir(source, { withFileTypes: true })) {
  if (entry.name.startsWith('.') || entry.name.endsWith('_wrong.html')) continue;
  if (!entry.isDirectory() && !entry.isFile()) throw new Error('Unsupported source entry');
  await cp(resolve(source, entry.name), resolve(destination, entry.name), {
    recursive: true,
    filter: path => !path.split(sep).some(part => part.startsWith('.')),
  });
}
console.log('Built public/ from baitapHTML/; original source preserved.');
