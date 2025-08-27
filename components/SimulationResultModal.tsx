import { memo } from "react";
import { Button, Modal, ScrollView, StyleSheet, Text, View } from "react-native";

import type { SimulationResult } from "../utils/definitions";
import { formatCurrencyBRL, formatPercentBR } from "../utils/formatters";

type Props = {
  result: SimulationResult | null;
  visible: boolean;
  onClose: () => void;
};

function SimulationResultModal({ result, visible, onClose }: Props) {
  return (
    <Modal visible={visible} animationType="fade" onRequestClose={onClose} transparent>
      <View style={styles.overlay}>
        <View style={styles.card}>
          <Text style={styles.title}>Resultado da simulação</Text>
          {result ? (
            <ScrollView contentContainerStyle={{ gap: 8 }}>
              <View style={styles.row}>
                <Text style={styles.label}>Produto</Text>
                <Text style={styles.value}>{result.product.name}</Text>
              </View>
              <View style={styles.row}>
                <Text style={styles.label}>Valor solicitado</Text>
                <Text style={styles.value}>{formatCurrencyBRL(result.principal)}</Text>
              </View>
              <View style={styles.row}>
                <Text style={styles.label}>Prazo</Text>
                <Text style={styles.value}>{`${result.term} meses`}</Text>
              </View>
              <View style={styles.row}>
                <Text style={styles.label}>Taxa efetiva mensal</Text>
                <Text style={styles.value}>{formatPercentBR(result.monthlyRate * 100)}</Text>
              </View>
              <View style={styles.row}>
                <Text style={styles.label}>Parcela mensal</Text>
                <Text style={styles.value}>{formatCurrencyBRL(result.payment)}</Text>
              </View>
              <View style={styles.row}>
                <Text style={styles.label}>Valor total com juros</Text>
                <Text style={styles.value}>{formatCurrencyBRL(result.total)}</Text>
              </View>
              <Text style={styles.sectionTitle}>Memória de cálculo</Text>
              {result.schedule.map((row) => (
                <View key={row.month} style={styles.scheduleRow}>
                  <Text>{`Mês ${row.month}`}</Text>
                  <Text>{`Juros ${formatCurrencyBRL(row.interest)}`}</Text>
                  <Text>{`Amortização: ${formatCurrencyBRL(row.amortization)}`}</Text>
                  <Text>{`Saldo: ${formatCurrencyBRL(row.balance)}`}</Text>
                </View>
              ))}
            </ScrollView>
          ) : null}
          <View style={{ gap: 8, marginTop: 12 }}>
            <Button title="Fechar" onPress={onClose} />
          </View>
        </View>
      </View>
    </Modal>
  );
}

const styles = StyleSheet.create({
  overlay: {
    alignItems: "center",
    backgroundColor: "rgba(0,0,0,0.5)",
    flex: 1,
    justifyContent: "center",
    paddingHorizontal: 24,
  },
  card: {
    backgroundColor: "#fff",
    borderRadius: 12,
    gap: 24,
    height: "80%",
    overflow: "hidden",
    padding: 24,
    width: "100%",
  },
  title: {
    fontSize: 24,
    fontWeight: "700",
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: "600",
  },
  row: {
    flexDirection: "row",
    justifyContent: "space-between",
  },
  label: {
    color: "#444",
    fontWeight: "600",
  },
  value: {
    color: "#111",
    fontWeight: "500",
  },
  scheduleRow: {
    borderTopColor: "#eee",
    borderTopWidth: 1,
    paddingTop: 6,
  },
});

export default memo(SimulationResultModal);
