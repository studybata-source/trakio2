export async function GET(){
  const urls = ['/', '/wishlist', '/compare'];
  const xml = `<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">${urls.map(u=>`<url><loc>${process.env.NEXT_PUBLIC_SITE_ORIGIN||'http://localhost:3000'}${u}</loc></url>`).join('')}</urlset>`;
  return new Response(xml, { headers: { 'content-type': 'application/xml' } });
}