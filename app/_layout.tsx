import { Stack } from "expo-router";
import { StatusBar } from "expo-status-bar";

import { ProductProvider, UserProvider } from "@/contexts";

export default function RootLayout() {
  return (
    <UserProvider>
      <ProductProvider>
        <StatusBar style="dark" />
        <Stack screenOptions={{ animation: "fade", headerShown: false }}>
          <Stack.Screen name="index" />
          <Stack.Screen name="(tabs)" />
          <Stack.Screen name="+not-found" />
        </Stack>
      </ProductProvider>
    </UserProvider>
  );
}
