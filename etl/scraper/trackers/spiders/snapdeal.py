import scrapy
from datetime import datetime, timezone

class SnapdealSpider(scrapy.Spider):
    name = "snapdeal"
    def __init__(self, pid=None, *a, **kw):
        super().__init__(*a, **kw)
        if not pid:
            raise ValueError("pass pid=...")
        self.pid = pid
    def start_requests(self):
        url = f"https://www.snapdeal.com/product/{self.pid}"
        yield scrapy.Request(url, callback=self.parse)
    def parse(self, response):
        price_text = response.css('#selling-price-id::text').get()
        price = 0.0
        if price_text:
            price = float(price_text.replace('Rs.','').replace(',','').strip())
        yield {
            "product_id": self.pid,
            "marketplace": "snapdeal",
            "seller_id": "",
            "condition": "new",
            "base_price": price,
            "shipping": 0.0,
            "coupon_code": "",
            "coupon_savings": 0.0,
            "bank_offer_savings": 0.0,
            "lightning_deal": "",
            "stock_status": "in_stock",
            "prime_exclusive": 0,
            "currency": "INR",
            "scraped_at": datetime.now(timezone.utc),
        }