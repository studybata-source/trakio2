import { createYoga, createSchema } from "@graphql-yoga/next";

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

const resolvers = {
  Query: {
    product: (_: any, { id, marketplace }: any) => ({
      id,
      marketplace,
      title: "Mock Wireless Headphones",
      image: "https://via.placeholder.com/600x400",
      currency: "INR",
    }),
    search: () => [],
  },
  Product: {
    sparkline: (_: any, { range }: any) => generateSpark(range),
    currentOffer: () => ({
      final: { amount: 4139, currency: "INR" },
      breakdown: [
        { label: "MRP", delta: 4999 },
        { label: "Coupon", delta: -500 },
        { label: "Bank Offer", delta: -360 },
        { label: "Shipping", delta: 40 },
      ],
      seller: "MockSeller",
      stock: "in_stock",
      updatedAt: new Date().toISOString(),
    }),
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