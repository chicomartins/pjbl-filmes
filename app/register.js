import React, { useState } from "react";
import { View, Text, TextInput, Button, Image, Alert, StyleSheet } from "react-native";
import { useRouter } from "expo-router";
import * as ImagePicker from "expo-image-picker";
import { useAuth } from "../src/context/AuthContext";

export default function Register() {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [photo, setPhoto] = useState(null);
  const { register } = useAuth();
  const router = useRouter();

  async function pickImage() {
    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      aspect: [1, 1],
      quality: 0.7,
    });

    if (!result.canceled) {
      setPhoto(result.assets[0].uri);
    }
  }

  async function handleRegister() {
    if (!name || !email || !password)
      return Alert.alert("Erro", "Preencha todos os campos");

    try {
      await register({ name, email, password, photo });
      Alert.alert("Sucesso", "Cadastro realizado!");
      router.push("/login");
    } catch (err) {
      Alert.alert("Erro", err.message);
    }
  }

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Cadastro</Text>

      <View style={styles.imageContainer}>
        {photo ? (
          <Image source={{ uri: photo }} style={styles.avatar} />
        ) : (
          <Image
            source={{
              uri: "https://cdn-icons-png.flaticon.com/512/149/149071.png",
            }}
            style={styles.avatar}
          />
        )}
        <Button title="Escolher Foto" onPress={pickImage} />
      </View>

      <TextInput
        style={styles.input}
        placeholder="Nome"
        value={name}
        onChangeText={setName}
      />
      <TextInput
        style={styles.input}
        placeholder="Email"
        value={email}
        onChangeText={setEmail}
      />
      <TextInput
        style={styles.input}
        placeholder="Senha"
        value={password}
        onChangeText={setPassword}
        secureTextEntry
      />

      <Button title="Cadastrar" onPress={handleRegister} />
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
  imageContainer: { alignItems: "center", marginBottom: 20 },
  avatar: { width: 120, height: 120, borderRadius: 60, marginBottom: 10 },
});
