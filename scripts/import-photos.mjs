import { readdir, mkdir, writeFile, unlink } from 'node:fs/promises';
import { join, resolve } from 'node:path';
import sharp from 'sharp';

const root = resolve('Photo');
const output = resolve('public/images/album');
const selected = [
  '2025.5.1广州/IMG_5268.JPEG',
  '2025.7.24北京-秦皇岛-天津/IMG_9420.JPEG',
  '2026.5.1洛阳/IMG_2307.JPEG',
  '2026.10.1广州/1037f9a068e320202203fabaa1fdb0.JPEG',
];
const events = (await readdir(root, { withFileTypes: true }))
  .filter((entry) => entry.isDirectory())
  .map((entry) => {
    const match = /^(\d{4})\.(\d{1,2})\.(\d{1,2})(.+)$/.exec(entry.name);
    if (!match) throw new Error(`文件夹名称须包含完整日期和事件：${entry.name}`);
    const [, year, month, day, label] = match;
    const date = `${year}-${month.padStart(2, '0')}-${day.padStart(2, '0')}`;
    const parsed = new Date(`${date}T00:00:00Z`);
    if (!Number.isFinite(parsed.getTime()) || parsed.toISOString().slice(0, 10) !== date) throw new Error(`无效日期：${entry.name}`);
    return { folder: entry.name, date, label };
  }).sort((a, b) => a.date.localeCompare(b.date));

await mkdir(output, { recursive: true });
const photos = [];
const milestones = [];
const selectedUrls = new Map();
for (const event of events) {
  const files = (await readdir(join(root, event.folder)))
    .filter((name) => /\.(?:jpe?g|png|webp)$/i.test(name)).sort();
  if (!files.length) throw new Error(`事件文件夹没有可用图片：${event.folder}`);
  milestones.push({ date: event.date, label: event.date === '2024-08-08' ? `初见 · ${event.label}` : event.label, icon: event.label === '相恋' ? '💕' : event.date === '2024-08-08' ? '🌷' : '📍' });
  for (const [index, file] of files.entries()) {
    const id = `${event.date}-${String(index + 1).padStart(2, '0')}`;
    const source = join(root, event.folder, file);
    // Create web delivery copies only; preserve source files and image proportions.
    await sharp(source).rotate().resize({ width: 1920, height: 1920, fit: 'inside', withoutEnlargement: true }).webp({ quality: 85 }).toFile(join(output, `${id}.webp`));
    await sharp(source).rotate().resize({ width: 480, height: 640, fit: 'inside', withoutEnlargement: true }).webp({ quality: 80 }).toFile(join(output, `${id}-thumb.webp`));
    const url = `/images/album/${id}.webp`;
    photos.push({ url, thumbnail: `/images/album/${id}-thumb.webp`, caption: `${event.label} · ${event.date.replaceAll('-', '.')}`, date: event.date, album: event.label });
    selectedUrls.set(`${event.folder}/${file}`, url);
  }
}
const featuredUrls = selected.map((source) => {
  const url = selectedUrls.get(source);
  if (!url) throw new Error(`找不到指定首页照片：${source}`);
  return url;
});
await writeFile('src/config/album.json', JSON.stringify({ milestones, photos, featuredUrls }, null, 2) + '\n');
const expected = new Set(photos.flatMap((photo) => [photo.url.split('/').at(-1), photo.thumbnail.split('/').at(-1)]));
for (const file of await readdir(output)) {
  // Only remove this importer's obsolete generated files; never source photos.
  if (/^\d{4}-\d{2}-\d{2}-\d+(?:-thumb)?\.webp$/.test(file) && !expected.has(file)) await unlink(join(output, file));
}
console.log(`Imported ${photos.length} photos in ${events.length} events; selected ${featuredUrls.length} homepage photos.`);
