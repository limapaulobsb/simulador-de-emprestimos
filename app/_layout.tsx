import { Stack } from "expo-router";
import { StatusBar } from "expo-status-bar";

import { UserProvider } from "@/contexts";

export default function RootLayout() {
  return (
    <UserProvider>
      <StatusBar style="dark" />
      <Stack>
        <Stack.Screen name="index" options={{ headerShown: false }} />
        <Stack.Screen name="(tabs)" options={{ headerShown: false }} />
        <Stack.Screen name="+not-found" options={{ headerShown: false }} />
      </Stack>
    </UserProvider>
  );
}
