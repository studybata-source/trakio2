export const flags = {
  predictiveCone: process.env.NEXT_PUBLIC_FLAG_PREDICTIVE_CONE === '1',
  threeD: process.env.NEXT_PUBLIC_FLAG_3D === '1',
  alerts: process.env.NEXT_PUBLIC_FLAG_ALERTS !== '0',
};