import { useFocusEffect } from "expo-router";
import { useCallback, useEffect, useMemo, useState } from "react";

import {
  ActivityIndicator,
  Alert,
  Button,
  KeyboardAvoidingView,
  Platform,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  View,
} from "react-native";

import { PrimaryButton, SimulationResultModal } from "../../components";
import api from "../../lib/api";
import { simulateLoan } from "../../utils/calculations";
import type { LoanProduct, SimulationResult } from "../../utils/definitions";

function LoanSimulationScreen() {
  const [amount, setAmount] = useState<string>("");
  const [error, setError] = useState<string | null>(null);
  const [formError, setFormError] = useState<string | null>(null);
  const [installments, setInstallments] = useState<string>("");
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [isModalOpen, setIsModalOpen] = useState<boolean>(false);
  const [isSelectorOpen, setIsSelectorOpen] = useState<boolean>(false);
  const [products, setProducts] = useState<LoanProduct[]>([]);
  const [result, setResult] = useState<SimulationResult | null>(null);
  const [selectedProductId, setSelectedProductId] = useState<number | null>(null);

  const selectedProduct = useMemo(
    () => products.find((p) => p.id === selectedProductId) ?? null,
    [products, selectedProductId],
  );

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

  const validate = (): { isValid: boolean; message?: string } => {
    if (!selectedProduct) {
      return { isValid: false, message: "Selecione um produto." };
    }

    const parsedAmount = Number(amount.replace(",", "."));

    if (Number.isNaN(parsedAmount) || parsedAmount <= 0) {
      return { isValid: false, message: "Valor do empréstimo deve ser maior que 0." };
    }

    const parsedInstallments = Number(installments);

    if (!Number.isInteger(parsedInstallments) || parsedInstallments <= 0) {
      return { isValid: false, message: "Número de parcelas deve ser maior que 0." };
    }

    if (parsedInstallments > selectedProduct.maximumTerm) {
      return {
        isValid: false,
        message: `Número de parcelas deve ser ≤ ${selectedProduct.maximumTerm}.`,
      };
    }

    return { isValid: true };
  };

  const handleSubmit = () => {
    setFormError(null);
    const validation = validate();

    if (!validation.isValid) {
      setFormError(validation.message ?? "Dados inválidos.");
      Alert.alert("Formulário inválido", validation.message);
      return;
    }

    const parsedAmount = Number(amount.replace(",", "."));
    const parsedInstallments = Number(installments);

    const simulation = simulateLoan(
      selectedProduct as LoanProduct,
      parsedAmount,
      parsedInstallments,
    );

    setResult(simulation);
    setIsModalOpen(true);
  };

  useEffect(() => {
    loadProducts();
  }, []);

  useFocusEffect(
    useCallback(() => {
      loadProducts();
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
    <KeyboardAvoidingView
      style={{ flex: 1 }}
      behavior={Platform.select({ ios: "padding", android: undefined })}
    >
      <ScrollView contentContainerStyle={styles.container} keyboardShouldPersistTaps="handled">
        <View style={styles.formGroup}>
          <Text style={styles.label}>Produto</Text>
          <View style={styles.selectorContainer}>
            <Pressable style={styles.selector} onPress={() => setIsSelectorOpen((v) => !v)}>
              <Text style={styles.selectorText}>
                {selectedProduct ? selectedProduct.name : "Selecione um produto"}
              </Text>
            </Pressable>
            {isSelectorOpen ? (
              <View style={styles.dropdown}>
                <ScrollView nestedScrollEnabled>
                  {products.length === 0 ? (
                    <View style={{ padding: 12 }}>
                      <Text>Nenhum produto cadastrado.</Text>
                    </View>
                  ) : (
                    products.map((item) => (
                      <Pressable
                        key={String(item.id ?? item.name)}
                        style={styles.dropdownItem}
                        onPress={() => {
                          setSelectedProductId(item.id ?? null);
                          setIsSelectorOpen(false);
                        }}
                      >
                        <Text style={styles.dropdownItemTitle}>{item.name}</Text>
                        <Text style={styles.dropdownItemSub}>
                          Taxa anual: {item.annualInterestRate}% — Máx: {item.maximumTerm} meses
                        </Text>
                      </Pressable>
                    ))
                  )}
                </ScrollView>
              </View>
            ) : null}
          </View>
        </View>
        <View style={styles.formGroup}>
          <Text style={styles.label}>Valor do empréstimo</Text>
          <TextInput
            style={styles.input}
            placeholder="Ex.: 10000,00"
            placeholderTextColor="#999"
            keyboardType="decimal-pad"
            value={amount}
            onChangeText={setAmount}
            returnKeyType="next"
          />
        </View>
        <View style={styles.formGroup}>
          <Text style={styles.label}>Número de parcelas</Text>
          <TextInput
            style={styles.input}
            placeholder={selectedProduct ? `Até ${selectedProduct.maximumTerm}` : "Ex.: 12"}
            placeholderTextColor="#999"
            keyboardType="number-pad"
            value={installments}
            maxLength={3}
            onChangeText={setInstallments}
            returnKeyType="done"
          />
          {selectedProduct ? (
            <Text style={styles.helpText}>
              Máximo permitido para este produto: {selectedProduct.maximumTerm} meses
            </Text>
          ) : null}
        </View>
        {formError ? <Text style={styles.errorText}>{formError}</Text> : null}
        <View style={styles.actionContainer}>
          <PrimaryButton onPress={handleSubmit}>Simular</PrimaryButton>
        </View>
      </ScrollView>
      <SimulationResultModal
        result={result}
        visible={isModalOpen}
        onClose={() => setIsModalOpen(false)}
      />
    </KeyboardAvoidingView>
  );
}

export default LoanSimulationScreen;

const styles = StyleSheet.create({
  container: {
    gap: 12,
    paddingHorizontal: 24,
    paddingVertical: 40,
  },
  centeredContainer: {
    alignItems: "center",
    flex: 1,
    justifyContent: "center",
  },
  loadingText: {
    marginTop: 8,
  },
  formGroup: {
    gap: 4,
  },
  label: {
    fontWeight: "600",
  },
  input: {
    backgroundColor: "#fff",
    borderColor: "#ddd",
    borderRadius: 8,
    borderWidth: 1,
    padding: 12,
  },
  selectorContainer: {
    gap: 0,
  },
  selector: {
    backgroundColor: "#fff",
    borderColor: "#ddd",
    borderRadius: 8,
    borderWidth: 1,
    padding: 12,
  },
  selectorText: {
    color: "#111",
  },
  dropdown: {
    backgroundColor: "#fff",
    borderColor: "#ddd",
    borderRadius: 8,
    borderWidth: 1,
    maxHeight: 220,
    overflow: "hidden",
  },
  dropdownItem: {
    borderBottomColor: "#eee",
    borderBottomWidth: 1,
    paddingHorizontal: 12,
    paddingVertical: 10,
  },
  dropdownItemTitle: {
    fontWeight: "600",
  },
  dropdownItemSub: {
    color: "#555",
  },
  helpText: {
    color: "#555",
  },
  actionContainer: {
    gap: 4,
    marginTop: 12,
  },
  errorText: {
    color: "red",
    marginBottom: 12,
  },
});
