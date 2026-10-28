import test from 'node:test';
import assert from 'node:assert/strict';
import { absoluteSiteUrl, withBase } from '../src/urls.ts';
import { resolveAnniversaries, resolveTimers, resolveIosStartupImages, resolveSiteImage, resolveSiteLogo } from '../src/config/resolvers.ts';
import { deepMerge, parseEnvConfigPatch } from '../src/config/merge.ts';

const site = 'https://1910853272.github.io/LovePage/';

test('unmarried couples do not receive marriage timers or anniversaries through defaults', () => {
  const config = { loveDate: '2025-01-01', marriageDate: '' };
  assert.deepEqual(resolveTimers(config), [{ date: '2025-01-01', label: '相恋时光', icon: '💕' }]);
  assert.deepEqual(resolveAnniversaries(config), [{ date: '2025-01-01', label: '相恋纪念日', icon: '💕' }]);
  const married = { ...config, marriageDate: '2026-10-01' };
  assert.equal(resolveTimers(married).length, 2);
  assert.equal(resolveAnniversaries(married).length, 2);
});

test('local resources receive the deployment base exactly once', () => {
  for (const input of ['photos/合影.jpg', '/photos/合影.jpg', './photos/合影.jpg', '/LovePage/photos/合影.jpg']) {
    assert.equal(withBase(input, '/LovePage/'), '/LovePage/photos/合影.jpg');
  }
  assert.equal(withBase('/LovePage-other/photo.jpg', '/LovePage'), '/LovePage/LovePage-other/photo.jpg');
  assert.equal(withBase('/music/song.mp3?v=2#start', '/LovePage'), '/LovePage/music/song.mp3?v=2#start');
  assert.equal(withBase('/favicon.svg', '/'), '/favicon.svg');
  assert.equal(withBase('/', '/LovePage'), '/LovePage/');
  assert.equal(withBase('/LovePage', '/LovePage/'), '/LovePage/');
});

test('external resources and fragments keep their original target', () => {
  for (const input of ['https://example.com/photo.jpg', 'http://example.com/music.mp3', '//example.com/photo.jpg', 'data:image/png;base64,abc', 'blob:https://example.com/id', '#timeline']) {
    assert.equal(withBase(input, '/LovePage'), input);
  }
});

test('canonical and alternate URLs resolve the Chinese and English pages', () => {
  assert.equal(absoluteSiteUrl('/', site), site);
  assert.equal(absoluteSiteUrl('/LovePage/', site), site);
  assert.equal(absoluteSiteUrl('/en-us/', site), `${site}en-us/`);
  assert.equal(absoluteSiteUrl('/LovePage/en-us/', site), `${site}en-us/`);
  assert.equal(absoluteSiteUrl('/zh-cn/', site), `${site}zh-cn/`);
  assert.equal(absoluteSiteUrl('/en-us/', site.slice(0, -1)), `${site}en-us/`);
  assert.equal(absoluteSiteUrl('/en-us/', 'https://example.com/'), 'https://example.com/en-us/');
});

test('cover, logo and startup images use absolute URLs without a repeated base', () => {
  const config = { siteUrl: site, siteImage: '/LovePage/images/cover.png', siteLogo: '/images/logo.png', photos: [] };
  assert.equal(resolveSiteImage(config), `${site}images/cover.png`);
  assert.equal(resolveSiteLogo(config), `${site}images/logo.png`);
  assert.deepEqual(resolveIosStartupImages({ ...config, iosStartupImages: [{ src: '/images/start.png' }] }), [{ href: `${site}images/start.png` }]);
  assert.equal(resolveSiteImage({ siteUrl: site, photos: [{ url: 'https://example.com/photo.jpg' }] }), 'https://example.com/photo.jpg');
  assert.equal(resolveSiteImage({ siteUrl: site, photos: [] }), `${site}images/share-cover.png`);
});

test('personal and environment overrides preserve explicit false and replace photo arrays', () => {
  const base = { demoMode: true, music: { enabled: false }, photos: [{ url: 'old.svg' }] };
  const patch = parseEnvConfigPatch('{"demoMode":false,"photos":[{"url":"new.jpg"}]}');
  assert.deepEqual(deepMerge(base, patch), { demoMode: false, music: { enabled: false }, photos: [{ url: 'new.jpg' }] });
  assert.throws(() => parseEnvConfigPatch('[]'), /must be a JSON object/);
});
