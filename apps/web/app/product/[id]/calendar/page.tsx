export default function CalendarHeatmap(){
  const days = Array.from({length: 180}, (_,i)=>({d: new Date(Date.now()-i*86400000), v: Math.random()})).reverse();
  return (
    <main>
      <section className="container" style={{ display:'grid', gap:16 }}>
        <h1>Best day to buy (heat-map)</h1>
        <div style={{ display:'grid', gridTemplateColumns: 'repeat(30, 16px)', gap: 4 }}>
          {days.map((x,i)=> (
            <div key={i} title={x.d.toDateString()} style={{ width:16, height:16, borderRadius:3, background: `hsl(${120*(1-x.v)} 80% 45%)`}} />
          ))}
        </div>
      </section>
    </main>
  );
}