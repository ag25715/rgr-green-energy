import { fetchSettings } from '@/lib/fetchSettings';

export async function GET() {
  const base = process.env.NEXT_PUBLIC_BASE_URL || 'https://rgrgreenenergy.com';
  const urls = ['/', '/about', '/solutions', '/projects', '/calculator', '/blog', '/contact', '/career', '/privacy', '/terms'];
  const now = new Date().toISOString();
  let projectUrls = [];
  let blogUrls = [];
  try {
    const [p, b] = await Promise.all([
      fetch(`${base}/api/projects`).then(r=>r.ok?r.json():[]),
      fetch(`${base}/api/blogs`).then(r=>r.ok?r.json():[]),
    ]);
    projectUrls = p.map(x=>`/projects/${x.slug}`);
    blogUrls = b.map(x=>`/blog/${x.slug}`);
  } catch {}
  const all = [...urls, ...projectUrls, ...blogUrls];
  const body = `<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n${all.map(u => `<url><loc>${base}${u}</loc><lastmod>${now}</lastmod></url>`).join('\n')}\n</urlset>`;
  return new Response(body, { headers: { 'Content-Type': 'application/xml' } });
}
