import { StyleSheet } from "react-native";

import { Colors, Spacings } from "../constants";

const globalStyles = StyleSheet.create({
  headingStandard: {
    fontSize: 28,
    fontWeight: "500",
  },
  headingSmall: {
    fontSize: 24,
    fontWeight: "500",
  },
  headingTiny: {
    fontSize: 20,
    fontWeight: "500",
  },
  label: {
    color: Colors.greyscale110,
    fontSize: 14,
    fontWeight: "600",
  },
  textHuge: {
    fontSize: 24,
  },
  textBig: {
    fontSize: 20,
  },
  textLarge: {
    fontSize: 18,
  },
  textStandard: {
    fontSize: 16,
  },
  textStandardMedium: {
    fontSize: 16,
    fontWeight: "500",
  },
  textSmall: {
    fontSize: 14,
  },
  textSmallMedium: {
    fontSize: 14,
    fontWeight: "500",
  },
  textError: {
    color: Colors.negative70,
  },
});

export default globalStyles;
