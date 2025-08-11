import Link from "next/link";

export default async function Page() {
  return (
    <main>
      <section className="container" style={{ display: 'grid', gap: 24 }}>
        <header style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
          <h1 style={{ margin: 0 }}>Price Tracker</h1>
          <nav style={{ display: 'flex', gap: 12 }}>
            <Link className="button" href="/product/B08N5WRWNW?m=amazon_in">Demo Product</Link>
            <Link className="button" href="/wishlist">Wishlist</Link>
            <Link className="button" href="/compare">Compare</Link>
          </nav>
        </header>
        <div className="card" style={{ padding: 24 }}>
          <h2 style={{ marginTop: 0 }}>“Give every shopper a Bloomberg-terminal-grade view of every rupee.”</h2>
          <p>Neon graphs. Predictive cones. Multi-channel alerts. Built for India, global-ready.</p>
        </div>
      </section>
    </main>
  );
}