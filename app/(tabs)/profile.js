import React from "react";
import { View, Text, Image, Button, StyleSheet } from "react-native";
import { useAuth } from "../../src/context/AuthContext";
import { useRouter } from "expo-router";

export default function ProfileScreen() {
  const { user, logout } = useAuth();
  const router = useRouter();

  if (!user) {
    // se o usuário não estiver logado, volta pra tela de login
    router.replace("/login");
    return null;
  }

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Meu Perfil</Text>

      {/* Foto de perfil (por enquanto imagem padrão) */}
      <Image
        source={{
          uri:
            user.photo ||
            "https://cdn-icons-png.flaticon.com/512/149/149071.png",
        }}
        style={styles.avatar}
        accessibilityLabel="Foto de perfil do usuário"
      />

      <Text style={styles.name}>{user.name}</Text>
      <Text style={styles.email}>{user.email}</Text>

      <Button title="Sair" color="#d9534f" onPress={async () => {
        await logout();
        router.replace("/login");
      }} />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "#fff",
    padding: 20,
  },
  title: {
    fontSize: 26,
    fontWeight: "bold",
    marginBottom: 30,
  },
  avatar: {
    width: 120,
    height: 120,
    borderRadius: 60,
    marginBottom: 20,
  },
  name: {
    fontSize: 22,
    fontWeight: "600",
    marginBottom: 10,
  },
  email: {
    fontSize: 18,
    color: "#555",
    marginBottom: 30,
  },
});
