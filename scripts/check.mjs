import assert from 'node:assert/strict';
import { readFile, stat, readdir } from 'node:fs/promises';
import { resolve, dirname, sep } from 'node:path';

const root = resolve('public');
const pages = ['index.html', 'index_new.html', 'about.html', 'news.html', 'blog.html', 'register.html', 'media.html'];
const enhanced = new Set(['index_new.html', 'register.html', 'media.html']);
assert.deepEqual((await readdir(root)).filter(name => name.endsWith('.html')).sort(), [...pages].sort());
for (const page of pages) {
  const html = await readFile(resolve(root, page), 'utf8');
  assert.match(html, /<!doctype html>/i);
  const ids = [...html.matchAll(/\bid="([^"]+)"/g)].map(match => match[1]);
  assert.equal(new Set(ids).size, ids.length, `${page}: duplicate id`);
  if (enhanced.has(page)) {
    assert.match(html, /<html lang="(?:vi|en)">/);
    for (const tag of ['main', 'h1']) assert.equal((html.match(new RegExp(`<${tag}\\b`, 'g')) || []).length, 1, `${page}: one ${tag}`);
    for (const tag of ['header', 'nav', 'aside', 'footer']) assert.match(html, new RegExp(`<${tag}\\b`));
    for (const img of html.matchAll(/<img\b[^>]*>/g)) assert.match(img[0], /\balt="[^"]+"/);
    for (const label of html.matchAll(/<label\b[^>]*\bfor="([^"]+)"/g)) assert(ids.includes(label[1]));
  }
  for (const match of html.matchAll(/\b(?:src|href|poster)="([^"]+)"/g)) {
    const reference = match[1];
    if (/^(?:https?:|data:|mailto:|\/\/)/.test(reference)) continue;
    const [pathname, fragment] = reference.split('#');
    const file = resolve(root, pathname.split('?')[0] || page);
    assert(file.startsWith(root + sep), `${page}: asset outside public`);
    assert((await stat(file)).isFile(), `${page}: missing ${reference}`);
    if (fragment && file.endsWith('.html')) assert((await readFile(file, 'utf8')).includes(`id="${fragment}"`), `${page}: missing anchor ${reference}`);
  }
  console.log(`${page}: structure and local references OK`);
}
async function checkCss(directory) {
  for (const entry of await readdir(directory, { withFileTypes: true })) {
    const path = resolve(directory, entry.name);
    if (entry.isDirectory()) await checkCss(path);
    else if (entry.name.endsWith('.css')) {
      for (const match of (await readFile(path, 'utf8')).matchAll(/url\(['"]?([^)'"\s]+)['"]?\)/g)) {
        if (/^(?:https?:|data:)/.test(match[1])) continue;
        const file = resolve(dirname(path), match[1].split('#')[0].split('?')[0]);
        assert(file.startsWith(root + sep));
        assert((await stat(file)).isFile(), `CSS: missing ${match[1]}`);
      }
    }
  }
}
await checkCss(root);
for (const [number, folder] of [[1, 'bai-1'], [2, 'bai-2']]) {
  const source = resolve('assignment_3', `Bai tap ${number} Tim va sua loi CSS`);
  const hosted = resolve(root, 'assignment_3', folder);
  const files = ['trang.html', 'style-loi.css', ...(await readdir(resolve(source, 'images'))).map(name => `images/${name}`)];
  for (const file of files) {
    assert.deepEqual(await readFile(resolve(hosted, file)), await readFile(resolve(source, file)), `${folder}: hosted copy differs: ${file}`);
  }
  console.log(`${folder}: HTML, CSS and images match source`);
}
const config = JSON.parse(await readFile('firebase.json', 'utf8'));
assert.equal(config.hosting.public, 'public');
assert.deepEqual(config.hosting.redirects, [{ source: '/', destination: '/index_new.html', type: 302 }]);
console.log('HTML pages, CSS assets and Firebase configuration OK');
