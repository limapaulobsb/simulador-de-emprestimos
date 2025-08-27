import { ReactNode } from "react";
import { ActivityIndicator, Pressable, StyleSheet, Text, View } from "react-native";

import { Colors } from "../constants";

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
    backgroundColor: Colors.primary90,
    flex: 1,
    justifyContent: "center",
    padding: 10,
  },
  text: {
    color: Colors.greyscale10,
    fontSize: 16,
    fontWeight: 500,
  },
});
