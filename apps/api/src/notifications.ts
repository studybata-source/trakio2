type NotifyInput = {
  type: 'priceDrop' | 'lightningDeal' | 'backInStock' | 'coupon';
  productId: string;
  marketplace: string;
  message: string;
};

export async function notify(input: NotifyInput) {
  // TODO: Plug Telegram/Email providers here. For now, log.
  console.log(`[notify] ${input.type} ${input.marketplace}/${input.productId}: ${input.message}`);
}