import { defineConfig } from 'astro/config';
import tailwindcss from '@tailwindcss/vite';
import sitemap from '@astrojs/sitemap';
import playformCompress from '@playform/compress';

export default defineConfig({
  site: 'https://1910853272.github.io',
  base: '/LovePage',
  trailingSlash: 'always',
  vite: {
    plugins: [tailwindcss()],
  },
  output: 'static',
  integrations: [sitemap(), playformCompress()],
  i18n: {
    defaultLocale: 'zh-cn',
    locales: ['zh-cn', 'en-us'],
    routing: {
      prefixDefaultLocale: false,
    },
  },
});
