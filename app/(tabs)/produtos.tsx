import { useEffect, useState } from "react";
import { ActivityIndicator, FlatList, RefreshControl, StyleSheet, Text, View } from "react-native";

import api from "../../lib/api";
import type { LoanProduct } from "../../utils/definitions";

function LoanProductScreen() {
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [isRefreshing, setIsRefreshing] = useState<boolean>(false);
  const [products, setProducts] = useState<LoanProduct[]>([]);
  const [error, setError] = useState<string | null>(null);

  async function loadProducts() {
    setIsLoading(true);
    setError(null);

    try {
      const data = await api.list();
      setProducts(data);
    } catch (e) {
      setError(e instanceof Error ? e.message : "Erro ao carregar produtos");
    } finally {
      setIsLoading(false);
    }
  }

  const onRefresh = async () => {
    setIsRefreshing(true);

    try {
      const data = await api.list();
      setProducts(data);
    } catch (e) {
      setError(e instanceof Error ? e.message : "Erro ao atualizar produtos");
    } finally {
      setIsRefreshing(false);
    }
  };

  useEffect(() => {
    loadProducts();
  }, []);

  if (isLoading && products.length === 0) {
    return (
      <View style={styles.centeredContainer}>
        <ActivityIndicator />
        <Text style={styles.loadingText}>Carregando produtos…</Text>
      </View>
    );
  }

  if (error && products.length === 0) {
    return (
      <View style={styles.centeredContainer}>
        <Text style={styles.errorText}>{error}</Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <FlatList
        data={products}
        keyExtractor={(item) => String(item.id ?? item.name)}
        contentContainerStyle={styles.list}
        refreshControl={<RefreshControl refreshing={isRefreshing} onRefresh={onRefresh} />}
        renderItem={({ item }) => (
          <View style={styles.card}>
            <Text style={styles.productName}>{item.name}</Text>
            <Text>
              Taxa anual: {item.annualInterestRate}% — Prazo máximo: {item.maximumTerm} meses
            </Text>
          </View>
        )}
        ListEmptyComponent={
          !isLoading
            ? () => (
                <View style={styles.centeredContainer}>
                  <Text>Nenhum produto encontrado.</Text>
                </View>
              )
            : null
        }
      />
    </View>
  );
}

export default LoanProductScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  list: {
    alignItems: "center",
    flex: 1,
    justifyContent: "center",
  },
  centeredContainer: {
    alignItems: "center",
    flex: 1,
    justifyContent: "center",
  },
  loadingText: {
    marginTop: 8,
  },
  errorText: {
    color: "red",
  },
  card: {
    backgroundColor: "#fff",
    borderColor: "#ddd",
    borderRadius: 8,
    borderWidth: 1,
    marginBottom: 12,
    padding: 12,
  },
  productName: {
    fontSize: 16,
    fontWeight: "bold",
    marginBottom: 4,
  },
});
