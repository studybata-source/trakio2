export default {
  async fetch(req, env, ctx) {
    const url = new URL(req.url);
    if (url.pathname.startsWith('/v1/sparkline')) {
      const pid = url.searchParams.get('id');
      const geo = req.cf?.country || 'IN';
      const key = `spark:${pid}:${geo}`;
      const cached = await env?.KV?.get?.(key, 'arrayBuffer');
      if (cached) {
        return new Response(cached, { headers: { 'content-type': 'application/json', 'cache-control': 'max-age=30' } });
      }
      const upstream = await fetch((env?.API || 'http://localhost:4000') + url.pathname + url.search, { headers: { 'x-geo': geo } });
      const body = await upstream.arrayBuffer();
      ctx.waitUntil(env?.KV?.put?.(key, body, { expirationTtl: 30 }));
      return new Response(body, upstream);
    }
    return new Response('ok');
  }
};