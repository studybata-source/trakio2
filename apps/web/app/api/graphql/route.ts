import { createYoga, createSchema } from "@graphql-yoga/next";
import { computeFinalPayable } from "@/lib/server/computeFinalPayable";
import { chQueryEachRow } from "@/lib/server/clickhouse";

const typeDefs = /* GraphQL */ `
  type Money { amount: Float! currency: String! }
  type PricePoint { t: String! base: Float! final: Float! stock: String! seller: String }
  type OfferBreakdown { label: String! delta: Float! }
  type Offer {
    final: Money!
    breakdown: [OfferBreakdown!]!
    seller: String
    stock: String
    updatedAt: String!
  }
  type Product {
    id: ID!
    marketplace: String!
    title: String!
    image: String
    currency: String!
    sparkline(range: String!): [PricePoint!]!
    currentOffer: Offer!
    forecast(range: String!): [PricePoint!]!
    verdict: Verdict!
  }
  type Verdict { decision: String! prob: Float! confidence: Float! reason: String! }
  type Alert { id: ID! type: String! params: String! active: Boolean! }
  type Query {
    product(id: ID!, marketplace: String!): Product
    search(q: String!, marketplace: String!, limit: Int = 10): [Product!]!
  }
  type Mutation {
    setAlert(productId: ID!, marketplace: String!, type: String!, params: String!): Alert!
    deleteAlert(id: ID!): Boolean!
  }
`;

const mockProduct = {
  id: "B08N5WRWNW",
  marketplace: "amazon_in",
  title: "Mock Wireless Headphones",
  image: "https://via.placeholder.com/600x400",
  currency: "INR",
};

function generateSpark(range: string) {
  const n = range === "1D" ? 96 : range === "7D" ? 7 * 96 : 300;
  const now = Date.now();
  let base = 4999;
  return Array.from({ length: n }, (_, i) => {
    const t = new Date(now - (n - i) * 15 * 60 * 1000).toISOString();
    const wiggle = Math.sin(i / 7) * 50 + (Math.random() - 0.5) * 30;
    base = Math.max(2999, base + wiggle);
    const final = base - 150;
    return { t, base, final, stock: "in_stock", seller: "MockSeller" };
  });
}

async function fetchSparklineCH(productId: string, marketplace: string, range: string) {
  const days = range === '1D' ? 1 : range === '7D' ? 7 : range === '1M' ? 30 : 90;
  const rows = await chQueryEachRow<{ t: string; base: number; final: number; stock: string; seller?: string }>(
    `SELECT
      formatDateTime(scraped_at, '%Y-%m-%dT%H:%M:%S') AS t,
      base_price AS base,
      greatest(base_price - coalesce(coupon_savings,0) - coalesce(bank_offer_savings,0) + coalesce(shipping,0), 0) AS final,
      stock_status AS stock,
      seller_id AS seller
     FROM price_ticks
     WHERE product_id = {pid:String} AND marketplace = {mkt:String}
       AND scraped_at >= now() - INTERVAL {days:Int32} DAY
     ORDER BY scraped_at ASC`,
    { pid: productId, mkt: marketplace, days }
  );
  return rows;
}

const resolvers = {
  Query: {
    product: (_: any, { id, marketplace }: any) => ({
      ...(mockProduct.id === id && mockProduct.marketplace === marketplace ? mockProduct : { id, marketplace, title: mockProduct.title, image: mockProduct.image, currency: mockProduct.currency })
    }),
    search: () => [mockProduct],
  },
  Product: {
    sparkline: async (p: any, { range }: any) => {
      try {
        const chRows = await fetchSparklineCH(p.id, p.marketplace, range);
        if (chRows.length) return chRows;
      } catch {}
      return generateSpark(range);
    },
    currentOffer: () => {
      const calc = computeFinalPayable({ mrp: 4999, coupon: 500, bankPct: 10, bankCap: 400, shipping: 40 });
      return {
        final: { amount: Math.round(calc.final * 100) / 100, currency: "INR" },
        breakdown: calc.breakdown.map(r => ({ label: r.label, delta: r.delta })),
        seller: "MockSeller",
        stock: "in_stock",
        updatedAt: new Date().toISOString(),
      };
    },
    forecast: (_: any, { range }: any) => generateSpark(range),
    verdict: () => ({ decision: "Hold", prob: 0.63, confidence: 0.71, reason: "Price trending down; expected lower in 3-5 days." }),
  },
  Mutation: {
    setAlert: () => ({ id: "1", type: "drop_pct", params: "{}", active: true }),
    deleteAlert: () => true,
  },
};

export const { GET, POST } = createYoga({
  schema: createSchema({ typeDefs, resolvers }),
  graphqlEndpoint: "/api/graphql",
});