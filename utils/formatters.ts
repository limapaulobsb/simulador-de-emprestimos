export function formatCurrencyBRL(value: number): string {
  const sign = value < 0 ? "-" : "";
  const n = Math.abs(value);
  const fixed = n.toFixed(2);
  const [intPart, decimalPart] = fixed.split(".");
  const withThousands = intPart.replace(/\B(?=(\d{3})+(?!\d))/g, ".");

  return `${sign}R$${withThousands},${decimalPart}`;
}

export function formatPercentBR(value: number): string {
  return `${value.toFixed(2).replace(".", ",")}%`;
}
