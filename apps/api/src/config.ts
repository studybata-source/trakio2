export const config = {
  apiPort: Number(process.env.API_PORT ?? 4000),
  clickhouseUrl: process.env.CLICKHOUSE_URL || "",
  clickhouseUser: process.env.CLICKHOUSE_USER || "",
  clickhousePassword: process.env.CLICKHOUSE_PASSWORD || "",
};