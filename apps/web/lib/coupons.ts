export type PriceContext = { mrp: number; couponCodes?: string[]; bank?: { pct?: number; cap?: number }; shipping?: number; codFee?: number; exchangeBonus?: number };
export function computePrice(context: PriceContext){
  const { mrp, couponCodes = [], bank = {}, shipping = 0, codFee = 0, exchangeBonus = 0 } = context;
  const couponSavings = couponCodes.includes('ICICI500') ? 500 : 0;
  const bankPct = bank.pct ?? 0;
  const bankCap = bank.cap ?? Infinity;
  const baseForBank = mrp - couponSavings;
  const bankSavings = Math.min((bankPct * baseForBank)/100, bankCap);
  const final = mrp - couponSavings - bankSavings + shipping + codFee - exchangeBonus;
  const breakdown = [
    { label: 'MRP', delta: mrp },
    ...(couponSavings? [{ label: 'Coupon', delta: -couponSavings }] : []),
    ...(bankSavings? [{ label: 'Bank Offer', delta: -bankSavings }] : []),
    ...(shipping? [{ label: 'Shipping', delta: shipping }] : []),
    ...(codFee? [{ label: 'COD', delta: codFee }] : []),
    ...(exchangeBonus? [{ label: 'Exchange', delta: -exchangeBonus }] : []),
  ];
  return { final, breakdown };
}