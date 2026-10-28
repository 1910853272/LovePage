import assert from 'node:assert/strict';
import { readFileSync, existsSync } from 'node:fs';
import { join } from 'node:path';

const origin = 'https://1910853272.github.io';
const base = '/LovePage/';
const expectedSite = `${origin}${base}`;
const pages = ['index.html', 'en-us/index.html', 'zh-cn/index.html'];

// The production compressor may remove attribute quotes and reorder attributes.
function attributes(tag) {
  return Object.fromEntries([...tag.matchAll(/([\w:-]+)\s*=\s*(?:"([^"]*)"|'([^']*)'|([^\s>]+))/g)]
    .map(([, key, quoted, singleQuoted, bare]) => [key, quoted ?? singleQuoted ?? bare]));
}

function checkLocalUrl(value) {
  if (!value.startsWith('/') && !value.startsWith(origin)) return;
  const url = new URL(value, origin);
  if (url.origin !== origin) return;
  assert.ok(url.pathname.startsWith(base), `Missing base: ${value}`);
  assert.ok(!url.pathname.includes('/LovePage/LovePage/'), `Repeated base: ${value}`);
  const relative = decodeURIComponent(url.pathname.slice(base.length));
  const target = join('dist', relative.endsWith('/') || !relative ? `${relative}index.html` : relative);
  assert.ok(existsSync(target), `Resource not found: ${value}`);
}

for (const page of pages) {
  const html = readFileSync(join('dist', page), 'utf8');
  const route = page.replace(/index\.html$/, '');
  const tags = [...html.matchAll(/<(?:link|meta|img|script|div)\b[^>]*>/g)].map(([tag]) => attributes(tag));
  assert.equal(tags.find((tag) => tag.rel === 'canonical')?.href, `${expectedSite}${route}`, `Wrong canonical: ${page}`);
  assert.equal(tags.find((tag) => tag.name === 'robots')?.content, 'noindex, nofollow', `Missing noindex: ${page}`);
  assert.ok(html.includes(`${expectedSite}en-us/`), `Missing English alternate: ${page}`);
  for (const tag of tags) {
    for (const key of ['src', 'href', 'data-url', 'content']) {
      if (tag[key]) checkLocalUrl(tag[key]);
    }
  }
}

const manifest = JSON.parse(readFileSync('dist/manifest.webmanifest', 'utf8'));
for (const key of ['id', 'scope', 'start_url']) assert.equal(manifest[key], base);
for (const icon of manifest.icons) checkLocalUrl(icon.src);
const sitemap = readFileSync('dist/sitemap-0.xml', 'utf8');
assert.ok(sitemap.includes(`${expectedSite}en-us/`));
assert.ok(!sitemap.includes('/LovePage/LovePage/'));
const album = JSON.parse(readFileSync('src/config/album.json', 'utf8'));
for (const photo of album.photos) {
  checkLocalUrl(`${base.slice(0, -1)}${photo.url}`);
  if (photo.thumbnail) checkLocalUrl(`${base.slice(0, -1)}${photo.thumbnail}`);
}
console.log('Validated 3 pages, local resources, canonical/alternate URLs, manifest and sitemap.');
