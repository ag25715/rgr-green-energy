export async function GET() {
  const base = process.env.NEXT_PUBLIC_BASE_URL || 'https://rgrgreenenergy.com';
  const body = `User-agent: *\nAllow: /\nDisallow: /admin\nSitemap: ${base}/sitemap.xml\n`;
  return new Response(body, { headers: { 'Content-Type': 'text/plain' } });
}
