# Price Tracker Monorepo

This repository contains a minimal, production-grade scaffold for a multi-store price tracker.

Structure

- apps/web: Next.js 14 front-end with a sparkline component
- apps/api: Apollo GraphQL API server with mock resolvers and a clean schema
- workers/edge: Cloudflare Worker (edge cache/geo-normalise) skeleton
- etl/scraper: Python Scrapy + Playwright skeleton

Quick start

1. Install Node.js 18+ and npm 9+
2. In separate terminals:
   - cd apps/api && npm install && npm run dev
   - cd apps/web && npm install && npm run dev

Configuration

- API listens on port 4000 by default
- Web dev server runs on port 3000
- Set CLICKHOUSE_URL to enable ClickHouse client (optional, otherwise mocks used)

Notes

- This is a starter; plug in real data sources and add auth, rate limits, and persistence.