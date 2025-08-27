import { ReactNode } from "react";
import { ActivityIndicator, Pressable, StyleSheet, Text, View } from "react-native";

import { Colors } from "../constants";

function PrimaryButton({
  children,
  variant = "primary",
  isLoading = false,
  onPress = () => {},
}: {
  children: ReactNode;
  variant?: "primary" | "secondary" | "secondaryOutlined";
  isLoading?: boolean;
  onPress?: () => void;
}) {
  let backgroundColor = Colors.secondary90;
  let borderColor = "transparent";
  let borderWidth = 0;
  let textColor = Colors.greyscale10;

  if (variant === "secondary") {
    backgroundColor = Colors.primary90;
  } else if (variant === "secondaryOutlined") {
    backgroundColor = "transparent";
    borderColor = Colors.primary90;
    borderWidth = 1;
    textColor = Colors.primary90;
  }

  return (
    <View style={[styles.outerContainer, { backgroundColor, borderWidth, borderColor }]}>
      <Pressable
        style={({ pressed }) => [styles.innerContainer, { opacity: pressed ? 0.8 : 1 }]}
        onPress={onPress}
        disabled={isLoading}
      >
        {isLoading ? (
          <ActivityIndicator color={textColor} />
        ) : (
          <Text style={[styles.text, { color: textColor }]}>{children}</Text>
        )}
      </Pressable>
    </View>
  );
}

export default PrimaryButton;

const styles = StyleSheet.create({
  outerContainer: {
    borderRadius: 8,
    height: 48,
    minWidth: 48,
    overflow: "hidden",
  },
  innerContainer: {
    alignItems: "center",
    flex: 1,
    justifyContent: "center",
    padding: 4,
  },
  text: {
    fontSize: 16,
    fontWeight: "500",
  },
});
