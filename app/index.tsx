import { Image } from "expo-image";
import { Link } from "expo-router";
import { StyleSheet, Text, TextInput, View, KeyboardAvoidingView, Platform } from "react-native";

import { PrimaryButton } from "@/components";
import { Colors, Spacings } from "@/constants";
import { useUser } from "@/contexts";
import globalStyles from "@/styles";

export default function IndexScreen() {
  const { name, setName } = useUser();

  return (
    <KeyboardAvoidingView
      style={styles.container}
      behavior={Platform.OS === "ios" ? "padding" : "height"}
      keyboardVerticalOffset={Platform.OS === "ios" ? 0 : -85}
    >
      <Image
        source={require("../assets/images/background.png")}
        contentPosition="bottom center"
        style={styles.image}
      />
      <View style={styles.content}>
        <Text style={[globalStyles.headingStandard, { color: Colors.greyscale10 }]}>
          Simulador de Empréstimos
        </Text>
        <View style={styles.form}>
          <TextInput
            style={globalStyles.input}
            placeholder="Digite seu nome..."
            placeholderTextColor={Colors.greyscale90}
            value={name}
            onChangeText={setName}
          />
          <Link href="/produtos" push asChild>
            <PrimaryButton>Entrar</PrimaryButton>
          </Link>
        </View>
      </View>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  image: {
    flexGrow: 1,
  },
  content: {
    backgroundColor: Colors.primary110,
    gap: Spacings.medium,
    height: 280,
    paddingHorizontal: Spacings.small,
  },
  form: {
    gap: Spacings.tiny,
  },
});
