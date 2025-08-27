import { Ionicons } from "@expo/vector-icons";
import { Tabs } from "expo-router";

export default function TabLayout() {
  return (
    <Tabs>
      <Tabs.Screen
        name="produtos"
        options={{
          title: "Produtos de Empréstimo",
          tabBarLabel: "Produtos",
          headerShown: false,
          tabBarIcon: ({ color, size }) => <Ionicons name="cube" color={color} size={size} />,
        }}
      />
      <Tabs.Screen
        name="simulacao"
        options={{
          title: "Simulação de Empréstimo",
          tabBarLabel: "Simulação",
          headerShown: false,
          tabBarIcon: ({ color, size }) => <Ionicons name="infinite" color={color} size={size} />,
        }}
      />
    </Tabs>
  );
}
