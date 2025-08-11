import json
import os
from datetime import datetime
from typing import Any, Dict, Iterable
import requests
from scrapy import signals
from scrapy.crawler import Crawler

class ClickHousePipeline:
    def __init__(self, ch_url: str | None, ch_user: str | None, ch_pass: str | None, ndjson_path: str):
        self.ch_url = ch_url
        self.ch_user = ch_user
        self.ch_pass = ch_pass
        self.ndjson_path = ndjson_path
        self._session = requests.Session()

    @classmethod
    def from_crawler(cls, crawler: Crawler):
        settings = crawler.settings
        ch_url = os.getenv("CLICKHOUSE_URL") or settings.get("CLICKHOUSE_URL")
        ch_user = os.getenv("CLICKHOUSE_USER") or settings.get("CLICKHOUSE_USER")
        ch_pass = os.getenv("CLICKHOUSE_PASSWORD") or settings.get("CLICKHOUSE_PASSWORD")
        ndjson = settings.get("OUTPUT_NDJSON") or "ticks.ndjson"
        pipe = cls(ch_url, ch_user, ch_pass, ndjson)
        crawler.signals.connect(pipe.spider_opened, signal=signals.spider_opened)
        return pipe

    def spider_opened(self, spider):
        if self.ch_url:
            # ensure table exists (idempotent)
            ddl = """
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
            ORDER BY (product_id, marketplace, scraped_at)
            """
            self._session.post(
                f"{self.ch_url}/?query={requests.utils.quote(ddl)}",
                auth=(self.ch_user, self.ch_pass) if self.ch_user else None,
                timeout=10,
            )

    def process_item(self, item: Dict[str, Any], spider):
        # normalize fields and write
        item.setdefault("ingest_version", 1)
        if isinstance(item.get("scraped_at"), datetime):
            item["scraped_at"] = item["scraped_at"].isoformat(sep=" ", timespec="milliseconds")
        if self.ch_url:
            data = (json.dumps(item) + "\n").encode()
            r = self._session.post(
                f"{self.ch_url}/?query=INSERT%20INTO%20price_ticks%20FORMAT%20JSONEachRow",
                data=data,
                auth=(self.ch_user, self.ch_pass) if self.ch_user else None,
                headers={"content-type": "application/x-ndjson"},
                timeout=10,
            )
            r.raise_for_status()
        else:
            with open(self.ndjson_path, "ab") as f:
                f.write(json.dumps(item).encode() + b"\n")
        return item