import React from "react";
import { render, fireEvent } from "@testing-library/react-native";
import SimulationResultModal from "../SimulationResultModal";

const result = {
  product: { id: 1, name: "Produto X", annualInterestRate: 24, maximumTerm: 60 },
  principal: 1000,
  term: 3,
  monthlyRate: Math.pow(1 + 0.24, 1 / 12) - 1,
  payment: 350,
  total: 1050,
  schedule: [
    { month: 1, interest: 10, amortization: 340, balance: 660 },
    { month: 2, interest: 8, amortization: 342, balance: 318 },
    { month: 3, interest: 5, amortization: 345, balance: 0 },
  ],
} as const;

describe("SimulationResultModal", () => {
  test("renders summary when visible and result provided", () => {
    const { getByText } = render(
      <SimulationResultModal visible result={result as any} onClose={jest.fn()} />,
    );
    expect(getByText("Resultado da simulação")).toBeTruthy();
    expect(getByText("Produto:")).toBeTruthy();
    expect(getByText("Produto X")).toBeTruthy();
  });

  test("calls onClose when button pressed", () => {
    const onClose = jest.fn();
    const { getByText } = render(
      <SimulationResultModal visible result={result as any} onClose={onClose} />,
    );
    fireEvent.press(getByText("Fechar"));
    expect(onClose).toHaveBeenCalled();
  });

  test("does not crash when result is null", () => {
    const { getByText } = render(
      <SimulationResultModal visible result={null} onClose={jest.fn()} />,
    );
    expect(getByText("Resultado da simulação")).toBeTruthy();
  });
});
