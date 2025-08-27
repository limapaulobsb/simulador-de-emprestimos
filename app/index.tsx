import { Link } from "expo-router";
import { Text, View } from "react-native";

import { PrimaryButton } from "@/components";

export default function Index() {
  return (
    <View
      style={{
        flex: 1,
        justifyContent: "center",
        alignItems: "center",
      }}
    >
      <Link href="/produtos" push asChild>
        <PrimaryButton>Entrar</PrimaryButton>
      </Link>
    </View>
  );
}
