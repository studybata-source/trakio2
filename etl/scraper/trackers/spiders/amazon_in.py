from __future__ import annotations
import json
from datetime import datetime, timezone
import re
import scrapy
from scrapy_playwright.page import PageMethod

PRICE_RE = re.compile(r"[\d,]+(?:\.\d+)?")

class AmazonINSpider(scrapy.Spider):
    name = "amazon_in"
    custom_settings = {
        "PLAYWRIGHT_PAGE_METHODS": [
            PageMethod("add_init_script", "Object.defineProperty(navigator, 'webdriver', {get: () => undefined})"),
        ]
    }

    def __init__(self, asin: str | None = None, *args, **kwargs):
        super().__init__(*args, **kwargs)
        if not asin:
            raise ValueError("Pass asin=... (e.g., asin=B08N5WRWNW)")
        self.asin = asin

    def start_requests(self):
        url = f"https://www.amazon.in/dp/{self.asin}"
        yield scrapy.Request(
            url,
            callback=self.parse_product,
            meta={"playwright": True, "playwright_include_page": True, "product_id": self.asin},
        )

    async def parse_product(self, response):
        page = response.meta.get("playwright_page")
        try:
            # Wait for price block or buybox
            await page.wait_for_selector('#apex_desktop, #corePrice_desktop, #buybox, #ppd', timeout=15000)
        except Exception:
            pass
        html = await page.content()
        await page.close()

        product_id = response.meta["product_id"]
        marketplace = "amazon_in"
        currency = "INR"

        # Extract title
        title = response.css('#productTitle::text').get()
        if title:
            title = title.strip()

        # Extract price from known selectors
        price_text = (
            response.css('#apex_desktop span.a-price-whole::text').get() or
            response.css('#corePrice_desktop span.a-price-whole::text').get() or
            response.css('#priceblock_ourprice::text').get() or
            response.css('#tp_price_block_total_price_ww span.a-price-whole::text').get()
        )
        price_value = None
        if price_text:
            m = PRICE_RE.search(price_text)
            if m:
                price_value = float(m.group(0).replace(',', ''))

        # Fallback JSON-LD
        if price_value is None:
            for ld in response.css('script[type="application/ld+json"]::text').getall():
                try:
                    data = json.loads(ld)
                    if isinstance(data, dict) and data.get('@type') in ('Product',):
                        offers = data.get('offers')
                        if isinstance(offers, dict):
                            p = offers.get('price')
                            if p:
                                price_value = float(str(p))
                                break
                except Exception:
                    continue

        stock_status = 'in_stock'
        if response.css('#availability .a-color-state, #availability .a-color-price'):
            txt = ''.join(response.css('#availability *::text').getall()).lower()
            if 'out of stock' in txt or 'unavailable' in txt:
                stock_status = 'out'

        seller = response.css('#tabular-buybox div.tabular-buybox-text a::text').get()
        if seller:
            seller = seller.strip()

        base_price = price_value or 0.0
        scraped_at = datetime.now(timezone.utc)

        yield {
            "product_id": product_id,
            "marketplace": marketplace,
            "seller_id": seller or "",
            "condition": "new",
            "base_price": base_price,
            "shipping": 0.0,
            "coupon_code": "",
            "coupon_savings": 0.0,
            "bank_offer_savings": 0.0,
            "lightning_deal": "",
            "stock_status": stock_status,
            "prime_exclusive": 0,
            "currency": "INR",
            "scraped_at": scraped_at,
        }