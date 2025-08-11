import scrapy

class AmazonINSpider(scrapy.Spider):
    name = "amazon_in_placeholder"
    start_urls = ["https://www.amazon.in/"]

    def parse(self, response):
        yield {
            "product_id": "B08N5WRWNW",
            "marketplace": "amazon_in",
            "base_price": 4999,
            "stock_status": "in_stock",
            "scraped_at": "2025-01-01T00:00:00Z",
        }