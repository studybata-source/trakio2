# ETL Scraper Skeleton

This folder contains a minimal Scrapy + Playwright setup outline for marketplace ingestion.

Setup

- python -m venv .venv && source .venv/bin/activate
- pip install -r requirements.txt
- playwright install chromium

Notes

- Implement spiders under spiders/*.py and yield normalized price tick items.
- Output can be pushed to Kafka or written to S3/ClickHouse via HTTP.