import 'dotenv/config';
import { getClickHouse } from './clickhouse.js';

async function main() {
  const ch = getClickHouse();
  if (!ch) {
    console.log('CLICKHOUSE_URL not set; skipping seed.');
    return;
  }

  const ddl = `
  CREATE TABLE IF NOT EXISTS price_ticks (
    product_id String,
    marketplace LowCardinality(String),
    seller_id LowCardinality(String),
    condition LowCardinality(String),
    base_price Float64,
    shipping Float64,
    coupon_code String,
    coupon_savings Float64,
    bank_offer_savings Float64,
    lightning_deal LowCardinality(String),
    stock_status LowCardinality(String),
    prime_exclusive UInt8,
    currency FixedString(3),
    scraped_at DateTime64(3),
    ingest_version UInt32
  )
  ENGINE = MergeTree
  PARTITION BY toYYYYMM(scraped_at)
  ORDER BY (product_id, marketplace, scraped_at);
  `;

  await ch.exec({ query: ddl });

  const pid = 'B08N5WRWNW';
  const mkt = 'amazon_in';
  const now = Date.now();
  const rows: any[] = [];
  let price = 4999;
  for (let i = 7*96; i >= 0; i--) {
    const ts = new Date(now - i * 15 * 60 * 1000);
    const wiggle = Math.sin(i / 7) * 50 + (Math.random() - 0.5) * 30;
    price = Math.max(2999, price + wiggle);
    rows.push({
      product_id: pid,
      marketplace: mkt,
      seller_id: 'MockSeller',
      condition: 'new',
      base_price: price,
      shipping: 40,
      coupon_code: 'ICICI500',
      coupon_savings: 500,
      bank_offer_savings: Math.min(0.1 * (price - 500), 400),
      lightning_deal: '',
      stock_status: 'in_stock',
      prime_exclusive: 0,
      currency: 'INR',
      scraped_at: ts.toISOString().replace('Z',''),
      ingest_version: 1,
    });
  }

  await ch.insert({
    table: 'price_ticks',
    values: rows,
    format: 'JSONEachRow'
  });
  console.log(`Seeded ${rows.length} ticks for ${pid}/${mkt}`);
}

main().catch((e) => { console.error(e); process.exit(1); });