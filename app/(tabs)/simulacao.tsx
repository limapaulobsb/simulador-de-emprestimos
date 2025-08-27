import { useFocusEffect } from "expo-router";
import { useCallback, useEffect, useMemo, useState } from "react";

import {
  ActivityIndicator,
  Alert,
  KeyboardAvoidingView,
  Platform,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  View,
} from "react-native";

import { Header, PrimaryButton, SimulationResultModal } from "@/components";
import { Colors, Spacings } from "@/constants";
import { useProducts } from "@/contexts";
import globalStyles from "@/styles";
import { simulateLoan } from "@/utils/calculations";
import type { LoanProduct, SimulationResult } from "@/utils/definitions";

export default function LoanSimulationScreen() {
  const { isLoading, productError, products, loadProducts } = useProducts();

  const [amount, setAmount] = useState<string>("");
  const [formError, setFormError] = useState<string | null>(null);
  const [installments, setInstallments] = useState<string>("");
  const [isModalOpen, setIsModalOpen] = useState<boolean>(false);
  const [isSelectorOpen, setIsSelectorOpen] = useState<boolean>(false);
  const [result, setResult] = useState<SimulationResult | null>(null);
  const [selectedProductId, setSelectedProductId] = useState<number | null>(null);

  const selectedProduct = useMemo(
    () => products.find((p) => p.id === selectedProductId) ?? null,
    [products, selectedProductId],
  );

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
  }, [loadProducts]);

  useFocusEffect(
    useCallback(() => {
      loadProducts();
      return undefined;
    }, [loadProducts]),
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
    <>
      <Header title={"Simulação"} />
      <KeyboardAvoidingView
        style={{ flex: 1 }}
        behavior={Platform.select({ ios: "padding", android: undefined })}
      >
        <ScrollView contentContainerStyle={styles.container} keyboardShouldPersistTaps="handled">
          <View style={styles.formGroup}>
            <Text style={globalStyles.label}>Produto</Text>
            <View>
              <Pressable style={styles.selector} onPress={() => setIsSelectorOpen((v) => !v)}>
                <Text style={styles.auxiliaryText}>
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
                          <Text style={globalStyles.textSmallMedium}>{item.name}</Text>
                          <Text style={styles.dropdownItemDescription}>
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
            <Text style={globalStyles.label}>Valor do empréstimo</Text>
            <TextInput
              style={globalStyles.input}
              placeholder="Ex.: 10000,00"
              placeholderTextColor={Colors.greyscale90}
              keyboardType="decimal-pad"
              value={amount}
              onChangeText={setAmount}
              returnKeyType="next"
            />
          </View>
          <View style={styles.formGroup}>
            <Text style={globalStyles.label}>Número de parcelas</Text>
            <TextInput
              style={globalStyles.input}
              placeholder={selectedProduct ? `Até ${selectedProduct.maximumTerm}` : "Ex.: 12"}
              placeholderTextColor={Colors.greyscale90}
              keyboardType="number-pad"
              value={installments}
              maxLength={3}
              onChangeText={setInstallments}
              returnKeyType="done"
            />
            {selectedProduct ? (
              <Text style={styles.auxiliaryText}>
                Máximo permitido para este produto: {selectedProduct.maximumTerm} meses
              </Text>
            ) : null}
          </View>
          {formError ? <Text style={globalStyles.textError}>{formError}</Text> : null}
          <View style={styles.actionContainer}>
            <PrimaryButton isLoading={isLoading} onPress={handleSubmit}>
              Fazer simulação
            </PrimaryButton>
          </View>
        </ScrollView>
        <SimulationResultModal
          result={result}
          visible={isModalOpen}
          onClose={() => setIsModalOpen(false)}
        />
      </KeyboardAvoidingView>
    </>
  );
}

const styles = StyleSheet.create({
  container: {
    gap: Spacings.micro,
    paddingHorizontal: Spacings.smaller,
    paddingVertical: Spacings.medium,
  },
  centeredContainer: {
    alignItems: "center",
    flex: 1,
    justifyContent: "center",
  },
  loadingText: {
    marginTop: Spacings.nano,
  },
  formGroup: {
    gap: Spacings.quark,
  },
  selector: {
    backgroundColor: Colors.greyscale10,
    borderColor: Colors.greyscale50,
    borderRadius: Spacings.nano,
    borderWidth: 1,
    padding: Spacings.micro,
  },
  dropdown: {
    backgroundColor: Colors.greyscale10,
    borderColor: Colors.greyscale50,
    borderRadius: Spacings.nano,
    borderWidth: 1,
    maxHeight: 240,
    overflow: "hidden",
  },
  dropdownItem: {
    borderBottomColor: Colors.greyscale30,
    borderBottomWidth: 1,
    paddingHorizontal: Spacings.micro,
    paddingVertical: Spacings.micro,
  },
  dropdownItemDescription: {
    color: Colors.greyscale90,
  },
  auxiliaryText: {
    color: Colors.greyscale110,
  },
  actionContainer: {
    gap: Spacings.quark,
    marginTop: Spacings.micro,
  },
});
