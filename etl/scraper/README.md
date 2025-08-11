# ETL Scraper Skeleton

This folder contains a Scrapy + Playwright setup for marketplace ingestion.

Setup

- python -m venv .venv && source .venv/bin/activate
- pip install -r requirements.txt
- playwright install chromium

Run (NDJSON output)

- cd etl/scraper
- scrapy crawl amazon_in -a asin=B08N5WRWNW
- Ticks will append to ticks.ndjson

Run (send to ClickHouse)

- export CLICKHOUSE_URL=http://localhost:8123
- export CLICKHOUSE_USER=default # if applicable
- export CLICKHOUSE_PASSWORD=    # if applicable
- scrapy crawl amazon_in -a asin=B08N5WRWNW

Notes

- The pipeline ensures the `price_ticks` table exists and inserts JSONEachRow.
- Respect site terms and rate limits; use proxies and proper headers for production.