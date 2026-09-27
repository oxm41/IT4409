import assert from 'node:assert/strict';
import { readFile, stat, readdir } from 'node:fs/promises';
import { resolve, dirname, sep } from 'node:path';

const root = resolve('public');
const pages = ['register.html', 'media.html'];
assert.deepEqual((await readdir(root)).filter(name => name.endsWith('.html')).sort(), [...pages].sort(), 'Website phải có đúng hai trang HTML');
for (const page of pages) {
  const html = await readFile(resolve(root, page), 'utf8');
  assert.match(html, /<!doctype html>/i);
  assert.match(html, /<html lang="vi">/);
  assert.equal((html.match(/<main\b/g) || []).length, 1, `${page}: chỉ có một main`);
  assert.equal((html.match(/<h1\b/g) || []).length, 1, `${page}: chỉ có một h1`);
  const ids = [...html.matchAll(/\bid="([^"]+)"/g)].map(match => match[1]);
  assert.equal(new Set(ids).size, ids.length, `${page}: id trùng`);
  for (const image of html.matchAll(/<img\b[^>]*>/g)) assert.match(image[0], /\balt="[^"]+"/, `${page}: ảnh thiếu alt`);
  for (const label of html.matchAll(/<label\b[^>]*\bfor="([^"]+)"/g)) assert(ids.includes(label[1]), `${page}: label không có control`);
  const references = [...html.matchAll(/\b(?:src|href)="([^"]+)"/g)].map(match => match[1]);
  for (const reference of references) {
    if (/^https?:\/\//.test(reference)) continue;
    const [pathname, fragment] = reference.split('#');
    const file = resolve(root, pathname.split('?')[0] || page);
    assert(file.startsWith(root + sep), `Asset ngoài public: ${reference}`);
    assert((await stat(file)).isFile(), `${page}: thiếu ${reference}`);
    if (fragment && file.endsWith('.html')) {
      const target = await readFile(file, 'utf8');
      assert(target.includes(`id="${fragment}"`), `${page}: anchor thiếu ${reference}`);
    }
  }
  console.log(`${page}: HTML cơ bản, label, alt và asset hợp lệ`);
}
const cssPath = resolve(root, 'assets/site.css');
const css = await readFile(cssPath, 'utf8');
for (const match of css.matchAll(/url\(['"]?([^)'"\s]+)['"]?\)/g)) {
  assert((await stat(resolve(dirname(cssPath), match[1]))).isFile(), `CSS: thiếu ${match[1]}`);
}
const config = JSON.parse(await readFile('firebase.json', 'utf8'));
assert.equal(config.hosting.public, 'public');
assert.deepEqual(config.hosting.rewrites, [{ source: '/', destination: '/media.html' }]);
console.log('CSS assets và thư mục Firebase public hợp lệ');
