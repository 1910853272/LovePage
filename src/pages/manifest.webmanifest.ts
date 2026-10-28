import { CONFIG, resolveSiteLogo } from '../config.ts';
import { withBase } from '../urls.ts';

interface ManifestIcon {
  src: string;
  type?: string;
  sizes?: string;
  purpose?: string;
}

function inferImageType(src: string): string | undefined {
  const normalized = src.split('?')[0]?.toLowerCase() || '';
  if (normalized.endsWith('.png')) return 'image/png';
  if (normalized.endsWith('.jpg') || normalized.endsWith('.jpeg')) return 'image/jpeg';
  if (normalized.endsWith('.webp')) return 'image/webp';
  if (normalized.endsWith('.svg')) return 'image/svg+xml';
  return undefined;
}

function buildIcons(logoSrc: string): ManifestIcon[] {
  const uniqueSources = Array.from(new Set([logoSrc].filter(Boolean)));
  return uniqueSources.map((src) => {
    const type = inferImageType(src);
    return {
      src,
      ...(type ? { type } : {}),
      sizes: type === 'image/svg+xml' ? 'any' : '512x512',
      purpose: 'any',
    };
  });
}

export const prerender = true;

export function GET(): Response {
  const siteName = CONFIG.siteName?.trim() || `${CONFIG.boy} ♥ ${CONFIG.girl}`;
  const shortName = siteName.length > 12 ? siteName.slice(0, 12) : siteName;
  const description = CONFIG.seoDescription || `${CONFIG.boy} 与 ${CONFIG.girl} 的专属爱页面`;
  const logoSrc = resolveSiteLogo(CONFIG);

  const manifest = {
    id: withBase('/', import.meta.env.BASE_URL),
    name: siteName,
    short_name: shortName,
    description,
    lang: CONFIG.siteLocale || 'zh-CN',
    start_url: withBase('/', import.meta.env.BASE_URL),
    scope: withBase('/', import.meta.env.BASE_URL),
    display: 'standalone',
    orientation: 'portrait',
    theme_color: CONFIG.defaultTheme === 'light' ? '#fffbfc' : '#0a0a1a',
    background_color: CONFIG.defaultTheme === 'light' ? '#fffbfc' : '#0a0a1a',
    icons: buildIcons(logoSrc),
    prefer_related_applications: false,
  };

  return new Response(JSON.stringify(manifest), {
    headers: {
      'Content-Type': 'application/manifest+json; charset=utf-8',
      'Cache-Control': 'public, max-age=3600',
    },
  });
}
