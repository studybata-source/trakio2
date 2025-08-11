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
ORDER BY (product_id, marketplace, scraped_at);

CREATE TABLE IF NOT EXISTS offers_current (
  product_id String,
  marketplace LowCardinality(String),
  seller_id LowCardinality(String),
  final_payable Float64,
  components Nested(name String, amount Float64),
  stock_status LowCardinality(String),
  updated_at DateTime64(3)
)
ENGINE = ReplacingMergeTree(updated_at)
ORDER BY (product_id, marketplace, seller_id);

CREATE TABLE IF NOT EXISTS alerts (
  user_id String,
  product_id String,
  marketplace LowCardinality(String),
  trigger_type LowCardinality(String),
  params_json String,
  created_at DateTime,
  active UInt8
)
ENGINE = MergeTree
ORDER BY (user_id, product_id, marketplace, created_at);