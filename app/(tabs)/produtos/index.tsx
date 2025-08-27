import { Link, useFocusEffect } from "expo-router";
import { useCallback, useEffect, useState } from "react";

import { ActivityIndicator, FlatList, RefreshControl, StyleSheet, Text, View } from "react-native";

import { PrimaryButton } from "../../../components";
import { Colors, Spacings } from "../../../constants";
import api from "../../../lib/api";
import globalStyles from "../../../styles";
import type { LoanProduct } from "../../../utils/definitions";

function LoanProductScreen() {
  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [isRefreshing, setIsRefreshing] = useState<boolean>(false);
  const [products, setProducts] = useState<LoanProduct[]>([]);

  const loadProducts = async () => {
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
  };

  const refreshProducts = async () => {
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

  useFocusEffect(
    useCallback(() => {
      refreshProducts();
      return undefined;
    }, []),
  );

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
        style={styles.listContainer}
        data={products}
        keyExtractor={(item) => String(item.id ?? item.name)}
        contentContainerStyle={styles.list}
        refreshControl={<RefreshControl refreshing={isRefreshing} onRefresh={refreshProducts} />}
        renderItem={({ item }) => (
          <View style={styles.card}>
            <Text style={globalStyles.textStandardMedium}>{item.name}</Text>
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
      <Link href="/produtos/novo" push asChild>
        <PrimaryButton>Novo Produto</PrimaryButton>
      </Link>
    </View>
  );
}

export default LoanProductScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    gap: Spacings.micro,
    paddingHorizontal: Spacings.smaller,
    paddingVertical: Spacings.medium,
  },
  listContainer: {
    flex: 1,
  },
  list: {
    gap: Spacings.micro,
  },
  centeredContainer: {
    alignItems: "center",
    flex: 1,
    justifyContent: "center",
  },
  loadingText: {
    marginTop: Spacings.nano,
  },
  errorText: {
    color: Colors.negative70,
  },
  card: {
    backgroundColor: Colors.greyscale10,
    borderColor: Colors.greyscale50,
    borderRadius: Spacings.nano,
    borderWidth: 1,
    gap: Spacings.quark,
    padding: Spacings.micro,
  },
});
