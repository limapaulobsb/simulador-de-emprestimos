import { formatCurrencyBRL, formatPercentBR } from "../formatters";

describe("formatters", () => {
  test("formatCurrencyBRL formats positives", () => {
    expect(formatCurrencyBRL(1234.5)).toBe("R$1.234,50");
  });

  test("formatCurrencyBRL formats negatives", () => {
    expect(formatCurrencyBRL(-10)).toBe("-R$10,00");
  });

  test("formatPercentBR formats percentage", () => {
    expect(formatPercentBR(1.5)).toBe("1,50%");
  });
});
