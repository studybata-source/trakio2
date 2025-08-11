import { computeFinalPayable } from "./computeFinalPayable.js";
import { fetchSparklineFromCH, getClickHouse } from "./clickhouse.js";

const mockProducts = [
  {
    id: "B08N5WRWNW",
    marketplace: "amazon_in",
    title: "Mock Wireless Headphones",
    image: "https://via.placeholder.com/600x400",
    currency: "INR",
  },
];

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

export const resolvers = {
  Query: {
    product: (_: unknown, { id, marketplace }: { id: string; marketplace: string }) => {
      return mockProducts.find(p => p.id === id && p.marketplace === marketplace) ?? null;
    },
    search: (_: unknown, { q, marketplace, limit }: { q: string; marketplace: string; limit: number }) => {
      return mockProducts.filter(p => p.marketplace === marketplace && p.title.toLowerCase().includes(q.toLowerCase())).slice(0, limit);
    },
  },
  Product: {
    sparkline: async (p: any, { range }: { range: string }) => {
      const ch = getClickHouse();
      if (ch) {
        const days = range === '1D' ? 1 : range === '7D' ? 7 : range === '1M' ? 30 : 90;
        const rows = await fetchSparklineFromCH(p.id, p.marketplace, days);
        if (rows.length) return rows;
      }
      return generateSpark(range);
    },
    currentOffer: () => {
      const calc = computeFinalPayable({ mrp: 4999, coupon: 500, bankPct: 10, bankCap: 400, shipping: 40, codFee: 0, exchangeBonus: 0 });
      return {
        final: { amount: Math.round(calc.final * 100) / 100, currency: "INR" },
        breakdown: calc.breakdown.map(r => ({ label: r.label, delta: r.delta })),
        seller: "MockSeller",
        stock: "in_stock",
        updatedAt: new Date().toISOString(),
      };
    },
    forecast: (_: any, { range }: { range: string }) => generateSpark(range).map(p => ({ ...p })),
    verdict: () => ({ decision: "Hold", prob: 0.63, confidence: 0.71, reason: "Price trending down; expected lower in 3-5 days." }),
  },
  Mutation: {
    setAlert: (_: unknown, { productId, marketplace, type, params }: any) => ({ id: `${productId}:${Date.now()}`, type, params, active: true }),
    deleteAlert: () => true,
  },
};