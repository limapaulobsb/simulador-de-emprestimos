import { router } from "expo-router";
import { useState } from "react";

import {
  Alert,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  View,
} from "react-native";

import { PrimaryButton } from "../../../components";
import { Colors, Spacings } from "../../../constants";
import api from "../../../lib/api";

function NewProductScreen() {
  const [name, setName] = useState<string>("");
  const [annualRate, setAnnualRate] = useState<string>("");
  const [maximumTerm, setMaximumTerm] = useState<string>("");
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  const validate = (): { isValid: boolean; message?: string } => {
    if (!name.trim()) {
      return { isValid: false, message: "Nome é obrigatório." };
    }

    const rate = Number(annualRate.replace(",", "."));

    if (Number.isNaN(rate) || rate <= 0) {
      return { isValid: false, message: "Taxa anual deve ser maior que 0." };
    }

    const term = Number(maximumTerm);

    if (!Number.isInteger(term) || term <= 0) {
      return { isValid: false, message: "Prazo máximo deve ser maior que 0." };
    }

    return { isValid: true };
  };

  const handleSubmit = async () => {
    setError(null);
    const validation = validate();

    if (!validation.isValid) {
      setError(validation.message ?? "Dados inválidos.");
      Alert.alert("Formulário inválido", validation.message);
      return;
    }

    try {
      setIsLoading(true);

      await api.create({
        name: name.trim(),
        annualInterestRate: Number(annualRate.replace(",", ".")),
        maximumTerm: Number(maximumTerm),
      });

      Alert.alert("Sucesso", "Produto criado com sucesso.");
      router.back();
    } catch (e) {
      const message = e instanceof Error ? e.message : "Erro ao salvar produto.";
      setError(message);
      Alert.alert("Erro", message);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <KeyboardAvoidingView
      style={{ flex: 1 }}
      behavior={Platform.select({ ios: "padding", android: undefined })}
    >
      <ScrollView contentContainerStyle={styles.container} keyboardShouldPersistTaps="handled">
        <View style={styles.formGroup}>
          <Text style={styles.label}>Nome</Text>
          <TextInput
            style={styles.input}
            placeholder="Ex.: Empréstimo Pessoal"
            placeholderTextColor="#999"
            value={name}
            onChangeText={setName}
            autoCapitalize="sentences"
            returnKeyType="next"
          />
        </View>
        <View style={styles.formGroup}>
          <Text style={styles.label}>Taxa anual (%)</Text>
          <TextInput
            style={styles.input}
            placeholder="Ex.: 12.5"
            placeholderTextColor="#999"
            keyboardType="number-pad"
            value={annualRate}
            maxLength={5}
            onChangeText={setAnnualRate}
            returnKeyType="next"
          />
        </View>
        <View style={styles.formGroup}>
          <Text style={styles.label}>Prazo máximo (meses)</Text>
          <TextInput
            style={styles.input}
            placeholder="Ex.: 60"
            placeholderTextColor="#999"
            keyboardType="number-pad"
            value={maximumTerm}
            maxLength={3}
            onChangeText={setMaximumTerm}
            returnKeyType="done"
          />
        </View>
        {error ? <Text style={styles.errorText}>{error}</Text> : null}
        <View style={styles.actionContainer}>
          <PrimaryButton variant="secondaryOutlined" onPress={() => router.back()}>
            Cancelar
          </PrimaryButton>
          <PrimaryButton onPress={handleSubmit}>
            Salvar
          </PrimaryButton>
        </View>
      </ScrollView>
    </KeyboardAvoidingView>
  );
}

export default NewProductScreen;

const styles = StyleSheet.create({
  container: {
    gap: Spacings.micro,
    padding: Spacings.smaller,
  },
  formGroup: {
    gap: Spacings.quark,
  },
  label: {
    fontWeight: "600",
  },
  input: {
    backgroundColor: Colors.greyscale10,
    borderColor: Colors.greyscale50,
    borderRadius: Spacings.nano,
    borderWidth: 1,
    padding: Spacings.micro,
  },
  actionContainer: {
    gap: Spacings.quark,
    marginTop: Spacings.micro,
  },
  errorText: {
    color: Colors.negative70,
    marginBottom: Spacings.micro,
  },
});
