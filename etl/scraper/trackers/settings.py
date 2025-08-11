BOT_NAME = "trackers"

SPIDER_MODULES = ["trackers.spiders"]
NEWSPIDER_MODULE = "trackers.spiders"

ROBOTSTXT_OBEY = False
CONCURRENT_REQUESTS = 8
DOWNLOAD_TIMEOUT = 45

# Playwright
DOWNLOAD_HANDLERS = {
    "http": "scrapy_playwright.handler.ScrapyPlaywrightDownloadHandler",
    "https": "scrapy_playwright.handler.ScrapyPlaywrightDownloadHandler",
}
TWISTED_REACTOR = "twisted.internet.asyncioreactor.AsyncioSelectorReactor"
PLAYWRIGHT_BROWSER_TYPE = "chromium"
PLAYWRIGHT_DEFAULT_NAVIGATION_TIMEOUT = 30000
PLAYWRIGHT_LAUNCH_OPTIONS = {
    "headless": True,
    "args": [
        "--disable-blink-features=AutomationControlled",
        "--no-sandbox",
        "--disable-dev-shm-usage",
    ],
}

USER_AGENT = "Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/119.0.0.0 Safari/537.36"

ITEM_PIPELINES = {
    "trackers.pipelines.ClickHousePipeline": 300,
}

CLICKHOUSE_URL = None  # e.g. "http://localhost:8123"
CLICKHOUSE_USER = None
CLICKHOUSE_PASSWORD = None
OUTPUT_NDJSON = "ticks.ndjson"