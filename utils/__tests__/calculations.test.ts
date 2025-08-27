import {
  buildAmortizationSchedule,
  calculateMonthlyPayment,
  calculateMonthlyRate,
  roundToCents,
  simulateLoan,
} from "../calculations";

describe("calculations", () => {
  test("calculateMonthlyRate converts annual percent to monthly rate", () => {
    const monthly = calculateMonthlyRate(12);
    expect(monthly).toBeCloseTo(Math.pow(1 + 0.12, 1 / 12) - 1, 10);
  });

  test("calculateMonthlyPayment handles zero rate as simple division", () => {
    expect(calculateMonthlyPayment(1200, 12, 0)).toBe(100);
  });

  test("calculateMonthlyPayment with positive rate", () => {
    const pmt = calculateMonthlyPayment(10000, 12, 0.02);
    expect(pmt).toBeCloseTo(945.6, 1);
  });

  test("roundToCents rounds to two decimals", () => {
    expect(roundToCents(1.234)).toBe(1.23);
    expect(roundToCents(1.235)).toBe(1.24);
  });

  test("buildAmortizationSchedule has correct length and final zero balance", () => {
    const payment = calculateMonthlyPayment(1000, 6, 0.02);
    const schedule = buildAmortizationSchedule(1000, 6, 0.02, payment);
    expect(schedule).toHaveLength(6);
    expect(schedule[schedule.length - 1].balance).toBe(0);
  });

  test("simulateLoan returns coherent results", () => {
    const result = simulateLoan(
      { id: 1, name: "Teste", annualInterestRate: 24, maximumTerm: 60 },
      5000,
      12,
    );
    expect(result.schedule.length).toBe(12);
    expect(result.principal).toBe(5000);
    expect(result.total).toBeGreaterThan(result.principal);
  });
});
