export type LoanProduct = {
  id?: number;
  name: string;
  annualInterestRate: number;
  maximumTerm: number;
};

export type ScheduleRow = {
  month: number;
  interest: number;
  amortization: number;
  balance: number;
};

export type SimulationResult = {
  product: LoanProduct;
  principal: number;
  term: number;
  monthlyRate: number;
  payment: number;
  schedule: ScheduleRow[];
  total: number;
};
