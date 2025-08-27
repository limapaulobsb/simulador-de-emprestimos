import { Stack } from "expo-router";

import { Header } from "@/components";

export default function StackLayout() {
  return (
    <>
      <Header title={"Produtos"} />
      <Stack screenOptions={{ animation: "fade", headerShown: false }}>
        <Stack.Screen name="index" />
        <Stack.Screen name="novo" />
      </Stack>
    </>
  );
}
