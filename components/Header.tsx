import { StyleSheet, Text, View } from "react-native";

import { Colors, Spacings } from "@/constants";
import globalStyles from "@/styles";

type Props = {
  title: string;
};

export default function Header({ title }: Props) {
  return (
    <View style={styles.container}>
      <Text style={[globalStyles.headingStandard, { color: Colors.greyscale10 }]}>{title}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: Colors.primary90,
    elevation: 4,
    paddingBottom: Spacings.small,
    paddingHorizontal: Spacings.small,
    paddingTop: Spacings.big,
  },
});
