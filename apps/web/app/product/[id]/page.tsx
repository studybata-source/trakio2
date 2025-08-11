import { PriceSpark } from "@/components/PriceSpark";
import Link from "next/link";

const API = process.env.NEXT_PUBLIC_GRAPHQL || "/api/graphql";

async function gql(query: string, variables?: Record<string, unknown>) {
  const res = await fetch(API, { method: 'POST', headers: { 'content-type': 'application/json' }, body: JSON.stringify({ query, variables }), cache: 'no-store' });
  const json = await res.json();
  if (json.errors) throw new Error(JSON.stringify(json.errors));
  return json.data;
}

const QUERY = `
query P($id: ID!, $m: String!, $range: String!){
  product(id: $id, marketplace: $m){
    id title image currency
    currentOffer { final { amount currency } breakdown { label delta } }
    sparkline(range: $range){ t base final stock seller }
  }
}`;

export default async function ProductPage({ params, searchParams }: { params: { id: string }, searchParams: { m?: string, range?: string } }) {
  const m = searchParams.m || 'amazon_in';
  const range = searchParams.range || '7D';
  const data = await gql(QUERY, { id: params.id, m, range });
  const p = data.product;
  const points = p.sparkline.map((_: any, i: number) => [i * (600 / p.sparkline.length), 20 + Math.sin(i / 7) * 8]);
  const d = points.reduce((acc: string, [x, y]: number[], idx: number) => acc + (idx === 0 ? `M${x} ${y}` : ` L${x} ${y}`), "");

  const ranges = ["1D","7D","1M","3M","6M","1Y","ALL"];

  return (
    <main>
      <section className="container" style={{ display: 'grid', gap: 16 }}>
        <Link href="/" style={{ color: "#aaa" }}>← Back</Link>
        <h1 style={{ marginBottom: 0 }}>{p.title}</h1>
        <div className="card" style={{ padding: 16 }}>
          <div style={{ display: 'flex', gap: 8, marginBottom: 8, flexWrap: 'wrap' }}>
            {ranges.map(r => (
              <Link key={r} className="button" href={`/product/${params.id}?m=${m}&range=${r}`}>{r}</Link>
            ))}
          </div>
          <PriceSpark d={d} />
          <div style={{ marginTop: 12 }}>
            <input type="range" min={0} max={p.sparkline.length-1} defaultValue={p.sparkline.length-1} style={{ width: '100%' }} />
          </div>
        </div>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(160px, 1fr))', gap: 12 }}>
          {p.currentOffer.breakdown.map((r: any) => (
            <div key={r.label} className="card" style={{ padding: 12 }}>
              <div style={{ color: "#aaa", fontSize: 12 }}>{r.label}</div>
              <div style={{ fontWeight: 600 }}>{r.delta > 0 ? "+" : ""}{r.delta}</div>
            </div>
          ))}
        </div>
      </section>
    </main>
  );
}