import { PriceSpark } from "../components/PriceSpark";

const samplePath = "M0 20 L50 15 L100 22 L150 14 L200 18 L250 12 L300 25 L350 10 L400 16 L450 8 L500 20 L550 12 L600 18";

export default function Page() {
  return (
    <main style={{ padding: 24 }}>
      <style>{`:root { --brand-hue: 223; --brand-sat: 85%; --brand-lit: 62%; --accent: hsl(223 85% 62%); }`}</style>
      <h1>Price Tracker Starter</h1>
      <p>GPU-smooth sparkline demo:</p>
      <div style={{ background: "#0b0b0b", borderRadius: 12, padding: 16, boxShadow: "0 0 32px rgba(0,0,0,.5)" }}>
        <PriceSpark d={samplePath} />
      </div>
    </main>
  );
}