import scrapy
from datetime import datetime, timezone

class AjioSpider(scrapy.Spider):
    name = "ajio"
    def __init__(self, pid=None, *a, **kw):
        super().__init__(*a, **kw)
        if not pid:
            raise ValueError("pass pid=...")
        self.pid = pid
    def start_requests(self):
        url = f"https://www.ajio.com/{self.pid}"
        yield scrapy.Request(url, callback=self.parse)
    def parse(self, response):
        price_text = response.css('.prod-sp span.price::text').get()
        price = 0.0
        if price_text:
            price = float(price_text.replace('₹','').replace(',','').strip())
        yield {
            "product_id": self.pid,
            "marketplace": "ajio",
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