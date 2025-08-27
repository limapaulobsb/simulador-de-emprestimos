import { ReactNode } from "react";
import { ActivityIndicator, Pressable, StyleSheet, Text, View } from "react-native";

function PrimaryButton({
  children,
  isLoading,
  onPress,
}: {
  children: ReactNode;
  isLoading?: boolean;
  onPress?: () => void;
}) {
  return (
    <View style={styles.outerContainer}>
      <Pressable
        style={({ pressed }) => [styles.innerContainer, { opacity: pressed ? 0.8 : 1 }]}
        onPress={onPress}
        disabled={isLoading}
      >
        {isLoading ? <ActivityIndicator /> : <Text style={styles.text}>{children}</Text>}
      </Pressable>
    </View>
  );
}

export default PrimaryButton;

const styles = StyleSheet.create({
  outerContainer: {
    borderRadius: 8,
    height: 42,
    overflow: "hidden",
    width: 180,
  },
  innerContainer: {
    alignItems: "center",
    backgroundColor: "#005ca9",
    flex: 1,
    justifyContent: "center",
    padding: 10,
  },
  text: {
    color: "#fff",
    fontSize: 16,
    fontWeight: 500,
  },
});
