import React, { useState } from "react";
import { View, Text, TextInput, Button, Alert, StyleSheet } from "react-native";
import { useRouter } from "expo-router";
import { useAuth } from "../src/context/AuthContext";

export default function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const { login } = useAuth();
  const router = useRouter();

  async function handleLogin() {
    const success = await login(email, password);
    if (success) router.replace("/(tabs)");
    else Alert.alert("Erro", "Credenciais inválidas");
  }

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Rate My Movie 🎬</Text>
      <TextInput style={styles.input} placeholder="Email" value={email} onChangeText={setEmail} />
      <TextInput
        style={styles.input}
        placeholder="Senha"
        value={password}
        onChangeText={setPassword}
        secureTextEntry
      />
      <Button title="Entrar" onPress={handleLogin} />
      <View style={{ height: 10 }} />
      <Button title="Cadastrar" onPress={() => router.push("/register")} />
      <View style={{ height: 10 }} />
      <Button
        title="Pular login"
        color="#999"
        onPress={() => router.replace("/(tabs)")}
        accessibilityLabel="Continuar sem fazer login"
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, justifyContent: "center", padding: 20 },
  title: { fontSize: 28, textAlign: "center", marginBottom: 20 },
  input: {
    borderWidth: 1,
    borderColor: "#ccc",
    padding: 10,
    borderRadius: 8,
    marginBottom: 10,
  },
});
