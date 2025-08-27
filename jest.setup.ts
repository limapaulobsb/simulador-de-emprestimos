import "@testing-library/jest-native/extend-expect";
import "whatwg-fetch";

// react-native-reanimated mock recommended by library
jest.mock("react-native-reanimated", () => require("react-native-reanimated/mock"));

// Silence React 19 act warnings for timers if any
global.setImmediate =
  global.setImmediate ||
  ((fn: (...args: any[]) => any, ...args: any[]) => setTimeout(fn, 0, ...args));

// Mock for expo-constants if accessed
jest.mock("expo-constants", () => ({
  default: {
    expoConfig: {},
    manifest: {},
  },
}));
