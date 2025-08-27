import { Stack } from "expo-router";
import { StatusBar } from "expo-status-bar";

import { ProductProvider, UserProvider } from "@/contexts";

export default function RootLayout() {
  return (
    <UserProvider>
      <ProductProvider>
        <StatusBar style="dark" />
        <Stack>
          <Stack.Screen name="index" options={{ headerShown: false }} />
          <Stack.Screen name="(tabs)" options={{ headerShown: false }} />
          <Stack.Screen name="+not-found" options={{ headerShown: false }} />
        </Stack>
      </ProductProvider>
    </UserProvider>
  );
}
