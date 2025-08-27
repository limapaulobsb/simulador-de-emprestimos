import { createContext, type ReactNode, useCallback, useContext, useMemo, useState } from "react";

import api from "@/lib/api";
import type { LoanProduct } from "@/utils/definitions";

type Props = {
  children: ReactNode;
};

type ProductContextValue = {
  isLoading: boolean;
  isRefreshing: boolean;
  productError: string | null;
  products: LoanProduct[];
  createProduct: (product: Omit<LoanProduct, "id">) => Promise<LoanProduct>;
  loadProducts: () => Promise<void>;
  refreshProducts: () => Promise<void>;
  removeProduct: (id: number) => Promise<void>;
  updateProduct: (id: number, product: Omit<LoanProduct, "id">) => Promise<LoanProduct>;
};

const ProductContext = createContext<ProductContextValue | undefined>(undefined);

export function ProductProvider({ children }: Props) {
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [isRefreshing, setIsRefreshing] = useState<boolean>(false);
  const [productError, setProductError] = useState<string | null>(null);
  const [products, setProducts] = useState<LoanProduct[]>([]);

  const createProduct = useCallback(async (product: Omit<LoanProduct, "id">) => {
    const created = await api.create(product);
    setProducts((prev) => [...prev, created]);

    return created;
  }, []);

  const loadProducts = useCallback(async () => {
    setIsLoading(true);
    setProductError(null);

    try {
      const data = await api.list();
      setProducts(data);
    } catch (e) {
      setProductError(e instanceof Error ? e.message : "Erro ao carregar produtos");
    } finally {
      setIsLoading(false);
    }
  }, []);

  const refreshProducts = useCallback(async () => {
    setIsRefreshing(true);
    setProductError(null);

    try {
      const data = await api.list();
      setProducts(data);
    } catch (e) {
      setProductError(e instanceof Error ? e.message : "Erro ao atualizar produtos");
    } finally {
      setIsRefreshing(false);
    }
  }, []);

  const removeProduct = useCallback(async (id: number) => {
    await api.remove(id);
    setProducts((prev) => prev.filter((p) => p.id !== id));
  }, []);

  const updateProduct = useCallback(async (id: number, product: Omit<LoanProduct, "id">) => {
    const updated = await api.update(id, product);
    setProducts((prev) => prev.map((p) => (p.id === id ? updated : p)));

    return updated;
  }, []);

  const value = useMemo(
    () => ({
      isLoading,
      isRefreshing,
      productError,
      products,
      createProduct,
      loadProducts,
      refreshProducts,
      removeProduct,
      updateProduct,
    }),
    [
      isLoading,
      isRefreshing,
      productError,
      products,
      createProduct,
      loadProducts,
      refreshProducts,
      removeProduct,
      updateProduct,
    ],
  );

  return <ProductContext.Provider value={value}>{children}</ProductContext.Provider>;
}

export function useProducts(): ProductContextValue {
  const ctx = useContext(ProductContext);

  if (!ctx) {
    throw new Error("useProducts must be used within a ProductProvider");
  }

  return ctx;
}
