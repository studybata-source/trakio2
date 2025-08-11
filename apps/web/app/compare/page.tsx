import Link from "next/link";

export default function ComparePage(){
  const ids = ["B08N5WRWNW","B0A1B2C3D4","B00TESTING"];
  return (
    <main>
      <section className="container" style={{ display:'grid', gap:16 }}>
        <h1>Compare</h1>
        <div style={{ display:'flex', gap:8, flexWrap:'wrap' }}>
          {ids.map(id => (<Link key={id} className="button" href={`/product/${id}?m=amazon_in`}>{id}</Link>))}
        </div>
        <div className="card" style={{ padding: 16 }}>
          <p style={{ color:'#aaa' }}>Sync cursor across graphs coming soon. Pinch to overlay planned.</p>
          <div style={{ height: 160, background:'#0b0b0b', borderRadius:8 }} />
        </div>
      </section>
    </main>
  );
}