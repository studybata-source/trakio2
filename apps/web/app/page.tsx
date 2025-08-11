import { PriceSpark } from "../components/PriceSpark";
import { gqlRequest } from "../lib/graphql";

const QUERY = `
query Demo($id: ID!, $m: String!){
  product(id: $id, marketplace: $m){
    id title image currency
    currentOffer { final { amount currency } breakdown { label delta } }
    sparkline(range: "7D"){ t base final stock seller }
  }
}`;

export default async function Page() {
  const data = await gqlRequest<{ product: any }>(QUERY, { id: "B08N5WRWNW", m: "amazon_in" });
  const p = data.product;

  // Convert sparkline to simple SVG path for demo
  const points = p.sparkline.map((_, i) => [i * (600 / p.sparkline.length), 20 + Math.sin(i / 7) * 8]);
  const d = points.reduce((acc: string, [x, y]: number[], idx: number) => acc + (idx === 0 ? `M${x} ${y}` : ` L${x} ${y}`), "");

  return (
    <main style={{ padding: 24 }}>
      <style>{`:root { --brand-hue: 223; --brand-sat: 85%; --brand-lit: 62%; --accent: hsl(223 85% 62%); }`}</style>
      <h1>{p.title}</h1>
      <p>Final: {p.currentOffer.final.amount} {p.currentOffer.final.currency}</p>
      <div style={{ background: "#0b0b0b", borderRadius: 12, padding: 16, boxShadow: "0 0 32px rgba(0,0,0,.5)", marginBottom: 16 }}>
        <PriceSpark d={d} />
      </div>
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(160px, 1fr))', gap: 12 }}>
        {p.currentOffer.breakdown.map((r: any) => (
          <div key={r.label} style={{ background: "#111", padding: 12, borderRadius: 8 }}>
            <div style={{ color: "#aaa", fontSize: 12 }}>{r.label}</div>
            <div style={{ fontWeight: 600 }}>{r.delta > 0 ? "+" : ""}{r.delta}</div>
          </div>
        ))}
      </div>
    </main>
  );
}