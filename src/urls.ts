/** Apply the deployment base once, keeping full external URLs unchanged. */
export function withBase(value: string, base: string): string {
  const trimmed = value.trim();
  if (/^(?:https?:)?\/\//i.test(trimmed) || /^(?:data:|blob:|#)/i.test(trimmed)) return trimmed;

  const basePath = `/${base.replace(/^\/+|\/+$/g, '')}`;
  const prefix = basePath === '/' ? '' : basePath;
  const [, pathname, suffix] = /^([^?#]*)(.*)$/.exec(trimmed)!;
  const path = `/${pathname.replace(/^(?:\.\/)+/, '').replace(/^\/+/, '')}`;
  if (path === prefix || path === `${prefix}/`) return `${prefix}/${suffix}`;
  if (prefix && path.startsWith(`${prefix}/`)) return `${path}${suffix}`;
  return `${prefix}${path}${suffix}`;
}

/** Resolve against the site's base without duplicating its project directory. */
export function absoluteSiteUrl(value: string, siteUrl: string): string {
  const site = new URL(siteUrl);
  return new URL(withBase(value, site.pathname), site.origin).href;
}
