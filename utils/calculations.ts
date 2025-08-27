import type { LoanProduct, ScheduleRow, SimulationResult } from "./definitions";

export function calculateMonthlyRate(annualRatePercent: number): number {
  const annualRate = annualRatePercent / 100;

  return Math.pow(1 + annualRate, 1 / 12) - 1;
}

export function calculateMonthlyPayment(
  principal: number,
  term: number,
  monthlyRate: number,
): number {
  if (monthlyRate <= 0) {
    return principal / term;
  }

  const factor = Math.pow(1 + monthlyRate, -term);

  return principal * (monthlyRate / (1 - factor));
}

export function roundToCents(value: number): number {
  return Math.round(value * 100) / 100;
}

export function buildAmortizationSchedule(
  principal: number,
  term: number,
  monthlyRate: number,
  payment: number,
): ScheduleRow[] {
  const rows: ScheduleRow[] = [];
  let balance = principal;

  for (let i = 1; i <= term; i += 1) {
    const interest = roundToCents(balance * monthlyRate);
    let amortization = roundToCents(payment - interest);
    let newBalance = roundToCents(balance - amortization);

    if (i === term) {
      // Adjust final row to eliminate residual due to rounding
      amortization = roundToCents(balance);
      newBalance = 0;
    }

    rows.push({ month: i, interest, amortization, balance: newBalance });
    balance = newBalance;
  }

  return rows;
}

export function simulateLoan(
  product: LoanProduct,
  principal: number,
  term: number,
): SimulationResult {
  const monthlyRate = calculateMonthlyRate(product.annualInterestRate);
  const payment = calculateMonthlyPayment(principal, term, monthlyRate);
  const schedule = buildAmortizationSchedule(principal, term, monthlyRate, payment);
  const total = roundToCents(payment * term);

  return {
    product,
    principal: roundToCents(principal),
    term,
    monthlyRate,
    payment: roundToCents(payment),
    schedule,
    total,
  };
}
