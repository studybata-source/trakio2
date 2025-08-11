export async function chQueryEachRow<T = any>(query: string, params?: Record<string, string | number>): Promise<T[]> {
  const url = process.env.CLICKHOUSE_URL;
  if (!url) return [];
  const qp = new URLSearchParams();
  if (params) {
    for (const [k, v] of Object.entries(params)) qp.set(k, String(v));
  }
  const resp = await fetch(`${url}/?${qp.toString()}`, {
    method: 'POST',
    headers: { 'content-type': 'application/sql' },
    body: query + ' FORMAT JSONEachRow',
    cache: 'no-store',
  });
  if (!resp.ok) throw new Error(`ClickHouse ${resp.status}`);
  const text = await resp.text();
  if (!text.trim()) return [];
  return text.trim().split('\n').map(line => JSON.parse(line));
}