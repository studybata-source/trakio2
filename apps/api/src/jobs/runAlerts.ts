import 'dotenv/config';
import { getClickHouse } from '../clickhouse.js';
import { notify } from '../notifications.js';

type DropHit = { product_id: string; marketplace: string; drop_pct: number };

async function scanClickhouse(xPct: number): Promise<DropHit[]> {
  const ch = getClickHouse();
  if (!ch) return [] as DropHit[];
  const query = `
    WITH prior AS (
      SELECT product_id, marketplace,
             argMin(base_price, scraped_at) FILTER (scraped_at >= now()-3600) AS prior_price,
             anyLast(base_price) AS now_price
      FROM price_ticks
      WHERE scraped_at >= now() - 3600
      GROUP BY product_id, marketplace
    )
    SELECT product_id, marketplace,
           (prior_price - now_price) / prior_price * 100 AS drop_pct
    FROM prior
    WHERE prior_price > 0 AND (prior_price - now_price) / prior_price * 100 >= {x:Float64}
  `;
  const rs = await ch.query({ query, format: 'JSONEachRow', query_params: { x: xPct } });
  return (await rs.json()) as DropHit[];
}

async function main() {
  const x = Number(process.env.DROP_PCT || 10);
  const hits = await scanClickhouse(x);
  for (const h of hits) {
    await notify({
      type: 'priceDrop',
      productId: h.product_id,
      marketplace: h.marketplace,
      message: `Drop ${h.drop_pct.toFixed(1)}%`
    });
  }
  console.log(`Alerts checked. Hits: ${hits.length}`);
}

main().catch((e) => { console.error(e); process.exit(1); });