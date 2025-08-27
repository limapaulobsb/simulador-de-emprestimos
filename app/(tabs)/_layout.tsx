import { Ionicons } from "@expo/vector-icons";
import { Tabs } from "expo-router";

import { Colors } from "@/constants";

export default function TabLayout() {
  return (
    <Tabs
      screenOptions={{
        headerShown: false,
        tabBarActiveTintColor: Colors.primary70,
      }}
    >
      <Tabs.Screen
        name="produtos"
        options={{
          title: "Produtos de Empréstimo",
          tabBarLabel: "Produtos",
          tabBarIcon: ({ color, size }) => <Ionicons name="cube" color={color} size={size} />,
        }}
      />
      <Tabs.Screen
        name="simulacao"
        options={{
          title: "Simulação de Empréstimo",
          tabBarLabel: "Simulação",
          tabBarIcon: ({ color, size }) => <Ionicons name="infinite" color={color} size={size} />,
        }}
      />
    </Tabs>
  );
}
