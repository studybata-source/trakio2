export default function WishlistPage(){
  const items = Array.from({length:8}, (_,i)=>({id:i,title:`Item ${i+1}`,trend:i%3}));
  const color = (t:number)=> t===0?"#20c997": t===1?"#ffbf00":"#ff5b5b";
  return (
    <main>
      <section className="container" style={{ display:'grid', gap:16 }}>
        <h1>Wishlist</h1>
        <div style={{ columns: '280px', columnGap: 16 }}>
          {items.map(it=> (
            <div key={it.id} className="card" style={{ breakInside:'avoid', padding:12, marginBottom:16 }}>
              <div style={{ display:'flex', alignItems:'center', justifyContent:'space-between' }}>
                <strong>{it.title}</strong>
                <span style={{ width:10, height:10, borderRadius:999, background:color(it.trend), display:'inline-block' }} />
              </div>
              <div style={{ height:120, background:'#0b0b0b', borderRadius:8, marginTop:8 }} />
            </div>
          ))}
        </div>
      </section>
    </main>
  );
}