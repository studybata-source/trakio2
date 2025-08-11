# Price Tracker Monorepo

This repository contains a minimal, production-grade scaffold for a multi-store price tracker.

Structure

- apps/web: Next.js 14 front-end with a sparkline component
- apps/api: Apollo GraphQL API server with mock/ClickHouse-backed resolvers
- workers/edge: Cloudflare Worker (edge cache/geo-normalise) skeleton
- etl/scraper: Python Scrapy + Playwright skeleton
- db/clickhouse.sql: DDL for core tables

Quick start

1. Install Node.js 18+ and npm 9+
2. Start API and Web (mocks by default):
   - cd apps/api && npm install && npm run dev
   - cd apps/web && npm install && npm run dev

Optional: ClickHouse

- Run ClickHouse locally or remotely, then set env:
  - CLICKHOUSE_URL=http://localhost:8123
  - CLICKHOUSE_USER=default
  - CLICKHOUSE_PASSWORD= (if any)
- Create tables and seed sample data:
  - cd apps/api && npm run seed:clickhouse
- API will auto-detect ClickHouse and serve real sparkline data.

Environment

- API_PORT: default 4000
- In web, set API_URL to the API endpoint (defaults to http://localhost:4000/)

Scripts

- npm -w apps/api run dev | build | start
- npm -w apps/api run seed:clickhouse
- npm -w apps/api run alerts
- npm -w apps/web run dev | build | start

Notes

- This is a starter; plug in real data sources, auth, rate limits, and persistence.