export function calculateHST(subtotal: number): number {
  return Math.round(subtotal * 0.13 * 100) / 100;
}

export function calculateTotal(subtotal: number, hst: number): number {
  return Math.round((subtotal + hst) * 100) / 100;
}

export function calculateBalance(total: number, paid: number): number {
  return Math.round((total - paid) * 100) / 100;
}
