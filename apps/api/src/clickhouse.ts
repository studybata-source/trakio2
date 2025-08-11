import { createClient, ClickHouseClient } from '@clickhouse/client';
import { config } from './config.js';

let client: ClickHouseClient | null = null;

export function getClickHouse(): ClickHouseClient | null {
  if (!config.clickhouseUrl) return null;
  if (!client) {
    client = createClient({
      url: config.clickhouseUrl,
      username: config.clickhouseUser || undefined,
      password: config.clickhousePassword || undefined,
    });
  }
  return client;
}

export type TickRow = {
  t: string;
  base: number;
  final: number;
  stock: string;
  seller?: string;
};

export async function fetchSparklineFromCH(productId: string, marketplace: string, rangeDays: number): Promise<TickRow[]> {
  const ch = getClickHouse();
  if (!ch) return [];
  const query = `
    SELECT
      formatDateTime(scraped_at, '%Y-%m-%dT%H:%M:%S') AS t,
      base_price AS base,
      greatest(base_price - coalesce(coupon_savings,0) - coalesce(bank_offer_savings,0) + coalesce(shipping,0), 0) AS final,
      stock_status AS stock,
      seller_id AS seller
    FROM price_ticks
    WHERE product_id = {pid:String} AND marketplace = {mkt:String}
      AND scraped_at >= now() - INTERVAL {days:Int32} DAY
    ORDER BY scraped_at ASC
  `;
  const rs = await ch.query({ query, format: 'JSONEachRow', query_params: { pid: productId, mkt: marketplace, days: rangeDays } });
  const rows = (await rs.json()) as TickRow[];
  return rows;
}