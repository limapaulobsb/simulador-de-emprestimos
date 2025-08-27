import { Link, useFocusEffect } from "expo-router";
import { useCallback, useEffect } from "react";
import { ActivityIndicator, FlatList, RefreshControl, StyleSheet, Text, View } from "react-native";

import { PrimaryButton } from "@/components";
import { Colors, Spacings } from "@/constants";
import { useProducts, useUser } from "@/contexts";
import globalStyles from "@/styles";

export default function LoanProductScreen() {
  const { isLoading, isRefreshing, productError, products, loadProducts, refreshProducts } =
    useProducts();

  const { name } = useUser();

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

  if (productError && products.length === 0) {
    return (
      <View style={styles.centeredContainer}>
        <Text style={globalStyles.textError}>{productError}</Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      {name ? <Text style={globalStyles.textLargeMedium}>Olá, {name}!</Text> : null}
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
        <PrimaryButton>Cadastrar Produto</PrimaryButton>
      </Link>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    gap: Spacings.small,
    paddingHorizontal: Spacings.small,
    paddingVertical: Spacings.medium,
  },
  listContainer: {
    flex: 1,
  },
  list: {
    gap: Spacings.tiny,
  },
  centeredContainer: {
    alignItems: "center",
    flex: 1,
    justifyContent: "center",
  },
  loadingText: {
    marginTop: Spacings.nano,
  },
  card: {
    backgroundColor: Colors.greyscale10,
    borderColor: Colors.greyscale50,
    borderRadius: Spacings.nano,
    borderWidth: 1,
    gap: Spacings.nano,
    padding: Spacings.tiny,
  },
});
