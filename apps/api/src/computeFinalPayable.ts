export type FinalPayableInput = {
  mrp: number;
  coupon?: number;
  bankPct?: number;
  bankCap?: number;
  shipping?: number;
  codFee?: number;
  exchangeBonus?: number;
};

export function computeFinalPayable(input: FinalPayableInput): {
  final: number;
  breakdown: { label: string; delta: number }[];
} {
  const breakdown: { label: string; delta: number }[] = [];
  breakdown.push({ label: "MRP", delta: input.mrp });
  if (input.coupon) breakdown.push({ label: "Coupon", delta: -input.coupon });
  const baseForBank = input.mrp - (input.coupon ?? 0);
  const bankRaw = (input.bankPct ?? 0) * baseForBank / 100;
  const bank = Math.min(bankRaw, input.bankCap ?? Number.POSITIVE_INFINITY);
  if (bank) breakdown.push({ label: "Bank Offer", delta: -bank });
  if (input.shipping) breakdown.push({ label: "Shipping", delta: input.shipping });
  if (input.codFee) breakdown.push({ label: "COD", delta: input.codFee });
  if (input.exchangeBonus) breakdown.push({ label: "Exchange", delta: -input.exchangeBonus });
  const final = breakdown.reduce((sum, row) => sum + row.delta, 0);
  return { final, breakdown };
}