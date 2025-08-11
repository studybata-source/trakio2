import { NextRequest, NextResponse } from 'next/server';

export async function POST(req: NextRequest){
  const body = await req.json().catch(()=>null);
  if(!body || !body.type || !body.productId) return NextResponse.json({ error: 'bad request' }, { status: 400 });
  // TODO: rate limit per user/channel via Redis
  // TODO: plug providers
  console.log('[alert]', body.type, body.productId, body.marketplace, body.message);
  return NextResponse.json({ ok: true });
}