import { Platform } from "react-native";

import type { LoanProduct } from "../utils/definitions";

function getBaseUrl(): string {
  const envUrl = process.env.EXPO_PUBLIC_API_URL ?? process.env.API_URL;

  if (envUrl && envUrl.length > 0) {
    return envUrl;
  }

  const defaultPort = 4000;
  const host = Platform.OS === "android" ? "10.0.2.2" : "localhost";

  return `http://${host}:${defaultPort}`;
}

const BASE_URL = getBaseUrl();

async function handleResponse<T>(res: Response): Promise<T> {
  if (!res.ok) {
    const message = await res.text().catch(() => res.statusText);
    throw new Error(`${res.status} ${res.statusText} - ${message}`);
  }

  return (await res.json()) as T;
}

const api = {
  async list(): Promise<LoanProduct[]> {
    const res = await fetch(`${BASE_URL}/produtos`);

    return handleResponse<LoanProduct[]>(res);
  },

  async getById(id: number): Promise<LoanProduct> {
    const res = await fetch(`${BASE_URL}/produtos/${id}`);

    return handleResponse<LoanProduct>(res);
  },

  async create(product: Omit<LoanProduct, "id">): Promise<LoanProduct> {
    const res = await fetch(`${BASE_URL}/produtos`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(product),
    });

    return handleResponse<LoanProduct>(res);
  },

  async update(id: number, product: Omit<LoanProduct, "id">): Promise<LoanProduct> {
    const res = await fetch(`${BASE_URL}/produtos/${id}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(product),
    });

    return handleResponse<LoanProduct>(res);
  },

  async patch(id: number, partial: Partial<Omit<LoanProduct, "id">>): Promise<LoanProduct> {
    const res = await fetch(`${BASE_URL}/produtos/${id}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(partial),
    });

    return handleResponse<LoanProduct>(res);
  },

  async remove(id: number): Promise<void> {
    const res = await fetch(`${BASE_URL}/produtos/${id}`, { method: "DELETE" });
    if (!res.ok) {
      const message = await res.text().catch(() => res.statusText);
      throw new Error(`${res.status} ${res.statusText} - ${message}`);
    }
  },
};

export default api;
