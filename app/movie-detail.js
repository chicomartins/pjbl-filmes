import { useLocalSearchParams } from "expo-router";
import { View, Text, Image, Button, TextInput, StyleSheet, Alert } from "react-native";
import React, { useState } from "react";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { useAuth } from "../src/context/AuthContext";

export default function MovieDetail() {
  const { movie } = useLocalSearchParams();
  const { user } = useAuth();
  const [rating, setRating] = useState("");
  const data = JSON.parse(movie);

  async function saveMovie() {
    if (!user) {
      Alert.alert("Atenção", "Você precisa estar logado para salvar filmes.");
      return;
    }

    if (!rating || isNaN(Number(rating)) || Number(rating) < 0 || Number(rating) > 10) {
      Alert.alert("Erro", "Informe uma nota válida entre 0 e 10.");
      return;
    }

    try {
      const stored = JSON.parse(await AsyncStorage.getItem("@myMovies")) || [];

      // Evita duplicar o mesmo filme do mesmo usuário
      const alreadyExists = stored.some(
        (m) => m.id === data.id && m.userEmail === user.email
      );
      if (alreadyExists) {
        Alert.alert("Aviso", "Você já salvou este filme.");
        return;
      }

      const newMovie = {
        id: data.id.toString(),
        title: data.title,
        overview: data.overview,
        poster: `https://image.tmdb.org/t/p/w300${data.poster_path}`,
        rating,
        userEmail: user.email,
      };

      stored.push(newMovie);
      await AsyncStorage.setItem("@myMovies", JSON.stringify(stored));
      Alert.alert("Sucesso", "Filme salvo com sucesso! 🍿");
      setRating("");
    } catch (error) {
      console.error("Erro ao salvar filme:", error);
      Alert.alert("Erro", "Não foi possível salvar o filme.");
    }
  }

  return (
    <View style={styles.container}>
      <Image
        source={{ uri: `https://image.tmdb.org/t/p/w500${data.poster_path}` }}
        style={styles.poster}
        resizeMode="cover"
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

      <Button title="Salvar na minha lista" onPress={saveMovie} color="#e50914" />
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, padding: 20, backgroundColor: "#fff" },
  poster: {
    width: "100%",
    height: 400,
    borderRadius: 12,
    marginBottom: 20,
  },
  title: {
    fontSize: 26,
    fontWeight: "bold",
    marginBottom: 10,
    color: "#111",
  },
  desc: {
    fontSize: 16,
    marginBottom: 20,
    color: "#555",
    textAlign: "justify",
  },
  input: {
    borderWidth: 1,
    borderColor: "#ccc",
    padding: 10,
    borderRadius: 8,
    marginBottom: 15,
    fontSize: 16,
  },
});
