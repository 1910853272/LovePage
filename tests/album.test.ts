import test from 'node:test';
import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';

const album = JSON.parse(readFileSync(new URL('../src/config/album.json', import.meta.url), 'utf8'));

test('album events are chronological and every photo belongs to an event', () => {
  const dates = album.milestones.map((event: { date: string }) => event.date);
  assert.deepEqual(dates, [...dates].sort());
  assert.equal(new Set(album.photos.map((photo: { url: string }) => photo.url)).size, album.photos.length);
  for (const photo of album.photos) {
    assert.ok(dates.includes(photo.date));
    assert.ok(photo.thumbnail.endsWith('-thumb.webp'));
  }
});

test('four homepage selections resolve to their original album indices', () => {
  assert.equal(album.featuredUrls.length, 4);
  const indices = album.featuredUrls.map((url: string) => album.photos.findIndex((photo: { url: string }) => photo.url === url));
  assert.ok(indices.every((index: number) => index >= 0));
  assert.deepEqual(indices.map((index: number) => album.photos[index].date), ['2025-05-01', '2025-07-24', '2026-05-01', '2026-10-01']);
});
