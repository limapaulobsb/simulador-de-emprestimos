import React from "react";
import { render, act } from "@testing-library/react-native";
import { ProductProvider, useProducts } from "../ProductContext";

jest.mock("@/lib/api", () => ({
  __esModule: true,
  default: {
    list: jest
      .fn()
      .mockResolvedValue([{ id: 1, name: "A", annualInterestRate: 10, maximumTerm: 10 }]),
    create: jest
      .fn()
      .mockResolvedValue({ id: 2, name: "B", annualInterestRate: 10, maximumTerm: 10 }),
    update: jest
      .fn()
      .mockResolvedValue({ id: 1, name: "A2", annualInterestRate: 10, maximumTerm: 10 }),
    remove: jest.fn().mockResolvedValue(undefined),
  },
}));

const mockedApi: any = require("@/lib/api").default;

function TestComponent({ onReady }: { onReady: (api: ReturnType<typeof useProducts>) => void }) {
  const api = useProducts();
  React.useEffect(() => {
    onReady(api);
  }, [api, onReady]);
  return null;
}

describe("ProductContext", () => {
  test("loadProducts populates products", async () => {
    let ctx: any;
    render(
      <ProductProvider>
        <TestComponent onReady={(api) => (ctx = api)} />
      </ProductProvider>,
    );
    await act(async () => {
      await ctx.loadProducts();
    });
    expect(ctx.products.length).toBe(1);
    expect(ctx.isLoading).toBe(false);
  });

  test("createProduct adds product", async () => {
    let ctx: any;
    render(
      <ProductProvider>
        <TestComponent onReady={(api) => (ctx = api)} />
      </ProductProvider>,
    );
    await act(async () => {
      await ctx.loadProducts();
      await ctx.createProduct({ name: "B", annualInterestRate: 10, maximumTerm: 10 });
    });
    expect(ctx.products.find((p: any) => p.id === 2)).toBeTruthy();
  });

  test("updateProduct updates product", async () => {
    let ctx: any;
    render(
      <ProductProvider>
        <TestComponent onReady={(api) => (ctx = api)} />
      </ProductProvider>,
    );
    await act(async () => {
      await ctx.loadProducts();
      await ctx.updateProduct(1, { name: "A2", annualInterestRate: 10, maximumTerm: 10 });
    });
    expect(ctx.products.find((p: any) => p.name === "A2")).toBeTruthy();
  });

  test("removeProduct removes product", async () => {
    let ctx: any;
    render(
      <ProductProvider>
        <TestComponent onReady={(api) => (ctx = api)} />
      </ProductProvider>,
    );
    await act(async () => {
      await ctx.loadProducts();
      await ctx.removeProduct(1);
    });
    expect(ctx.products.find((p: any) => p.id === 1)).toBeFalsy();
  });

  test("loadProducts handles error and sets productError", async () => {
    mockedApi.list.mockRejectedValueOnce(new Error("boom"));
    let ctx: any;
    render(
      <ProductProvider>
        <TestComponent onReady={(api) => (ctx = api)} />
      </ProductProvider>,
    );
    await act(async () => {
      await ctx.loadProducts();
    });
    expect(ctx.productError).toBe("boom");
    expect(ctx.isLoading).toBe(false);
  });

  test("loadProducts handles non-Error rejection and sets fallback message", async () => {
    mockedApi.list.mockRejectedValueOnce("oops");
    let ctx: any;
    render(
      <ProductProvider>
        <TestComponent onReady={(api) => (ctx = api)} />
      </ProductProvider>,
    );
    await act(async () => {
      await ctx.loadProducts();
    });
    expect(ctx.productError).toBe("Erro ao carregar produtos");
    expect(ctx.isLoading).toBe(false);
  });

  test("refreshProducts handles non-Error rejection and sets fallback message", async () => {
    mockedApi.list.mockRejectedValueOnce("no-error-instance");
    let ctx: any;
    render(
      <ProductProvider>
        <TestComponent onReady={(api) => (ctx = api)} />
      </ProductProvider>,
    );
    await act(async () => {
      await ctx.refreshProducts();
    });
    expect(ctx.productError).toBe("Erro ao atualizar produtos");
    expect(ctx.isRefreshing).toBe(false);
  });
});
