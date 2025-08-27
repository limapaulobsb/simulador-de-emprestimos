import { memo } from "react";
import { Modal, ScrollView, StyleSheet, Text, View } from "react-native";

import PrimaryButton from "./PrimaryButton";
import { Colors, Spacings } from "@/constants";
import globalStyles from "@/styles";
import type { SimulationResult } from "@/utils/definitions";
import { formatCurrencyBRL, formatPercentBR } from "@/utils/formatters";

type Props = {
  result: SimulationResult | null;
  visible: boolean;
  onClose: () => void;
};

export default function SimulationResultModal({ result, visible, onClose }: Props) {
  return (
    <Modal visible={visible} animationType="fade" onRequestClose={onClose} transparent>
      <View style={styles.overlay}>
        <View style={styles.card}>
          <Text style={globalStyles.headingSmall}>Resultado da simulação</Text>
          {result ? (
            <ScrollView contentContainerStyle={{ gap: 8 }}>
              <View style={styles.row}>
                <Text style={globalStyles.label}>Produto</Text>
                <Text style={globalStyles.textSmallMedium}>{result.product.name}</Text>
              </View>
              <View style={styles.row}>
                <Text style={globalStyles.label}>Valor solicitado</Text>
                <Text style={globalStyles.textSmallMedium}>
                  {formatCurrencyBRL(result.principal)}
                </Text>
              </View>
              <View style={styles.row}>
                <Text style={globalStyles.label}>Prazo</Text>
                <Text style={globalStyles.textSmallMedium}>{`${result.term} meses`}</Text>
              </View>
              <View style={styles.row}>
                <Text style={globalStyles.label}>Taxa efetiva mensal</Text>
                <Text style={globalStyles.textSmallMedium}>
                  {formatPercentBR(result.monthlyRate * 100)}
                </Text>
              </View>
              <View style={styles.row}>
                <Text style={globalStyles.label}>Parcela mensal</Text>
                <Text style={globalStyles.textSmallMedium}>
                  {formatCurrencyBRL(result.payment)}
                </Text>
              </View>
              <View style={styles.row}>
                <Text style={globalStyles.label}>Valor total com juros</Text>
                <Text style={globalStyles.textSmallMedium}>{formatCurrencyBRL(result.total)}</Text>
              </View>
              <Text style={globalStyles.textStandardMedium}>Memória de cálculo</Text>
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
          <PrimaryButton onPress={onClose}>Fechar</PrimaryButton>
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
    paddingHorizontal: Spacings.smaller,
  },
  card: {
    backgroundColor: Colors.greyscale10,
    borderRadius: Spacings.micro,
    gap: Spacings.smaller,
    height: "80%",
    overflow: "hidden",
    padding: Spacings.smaller,
    width: "100%",
  },
  row: {
    flexDirection: "row",
    justifyContent: "space-between",
  },
  scheduleRow: {
    borderTopColor: Colors.greyscale30,
    borderTopWidth: 1,
    paddingTop: Spacings.nano,
  },
});
