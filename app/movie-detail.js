import { useLocalSearchParams, useRouter } from "expo-router";
import {
  View,
  Text,
  Image,
  Button,
  TextInput,
  StyleSheet,
  TouchableOpacity,
  Alert,
} from "react-native";
import React, { useState } from "react";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { useAuth } from "../src/context/AuthContext";
import { Ionicons } from "@expo/vector-icons";

export default function MovieDetail() {
  const { movie } = useLocalSearchParams();
  const { user } = useAuth();
  const router = useRouter();
  const [rating, setRating] = useState("");
  const data = JSON.parse(movie);

  async function saveMovie() {
    // Se o usuário não estiver logado → redireciona pro login
    if (!user) {
      Alert.alert("Acesso restrito", "Faça login para salvar filmes.", [
        { text: "Cancelar", style: "cancel" },
        { text: "Fazer login", onPress: () => router.push("/login") },
      ]);
      return;
    }

    try {
      const key = `@movies_${user.email}`;
      const stored = await AsyncStorage.getItem(key);
      const list = stored ? JSON.parse(stored) : [];

      // Evita duplicatas
      if (!list.some((m) => m.id === data.id)) {
        list.push({
          id: data.id,
          title: data.title,
          poster: data.poster_path,
          overview: data.overview,
          rating: rating,
        });
        await AsyncStorage.setItem(key, JSON.stringify(list));
      }

      Alert.alert("Sucesso", "Filme salvo na sua lista!");
      setRating("");
      router.back();
    } catch (error) {
      Alert.alert("Erro", "Não foi possível salvar o filme.");
    }
  }

  return (
    <View style={styles.container}>
      {/* Botão de voltar */}
      <TouchableOpacity style={styles.backButton} onPress={() => router.back()}>
        <Ionicons name="arrow-back" size={28} color="#333" />
      </TouchableOpacity>

      <Image
        source={{ uri: `https://image.tmdb.org/t/p/w300${data.poster_path}` }}
        style={styles.poster}
      />

      <Text style={styles.title}>{data.title}</Text>
      <Text style={styles.desc}>{data.overview}</Text>

      <TextInput
        style={styles.input}
        value={rating}
        onChangeText={setRating}
        placeholder="Sua nota (0 a 10)"
        keyboardType="numeric"
      />

      <Button title="Salvar na minha lista" onPress={saveMovie} />
    </View>
  );
}

const styles = StyleSheet.create({
  container: { padding: 20, backgroundColor: "#fff", flex: 1 },
  backButton: {
    position: "absolute",
    top: 40,
    left: 20,
    zIndex: 10,
    backgroundColor: "rgba(255,255,255,0.8)",
    borderRadius: 50,
    padding: 5,
  },
  poster: {
    width: "100%",
    height: 380,
    borderRadius: 12,
    marginTop: 70,
    marginBottom: 20,
  },
  title: { fontSize: 26, fontWeight: "bold", marginBottom: 10 },
  desc: { marginBottom: 20, color: "#555" },
  input: {
    borderWidth: 1,
    borderColor: "#ccc",
    padding: 10,
    borderRadius: 8,
    marginBottom: 15,
  },
});
