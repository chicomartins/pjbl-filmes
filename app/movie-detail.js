import { useLocalSearchParams, useRouter } from "expo-router";
import {
  View,
  Text,
  Image,
  Button,
  StyleSheet,
  TouchableOpacity,
  Alert,
  Dimensions,
  ScrollView,
} from "react-native";
import React, { useState } from "react";
import { Ionicons } from "@expo/vector-icons";
import { doc, setDoc, getDoc } from "firebase/firestore";
import { db } from "../src/services/firebaseConfig";
import { useAuth } from "../src/context/AuthContext";

const { width, height } = Dimensions.get("window");

export default function MovieDetail() {
  const { movie } = useLocalSearchParams();
  const { user } = useAuth();
  const router = useRouter();
  const [rating, setRating] = useState(0);
  const data = JSON.parse(movie);

  const renderStars = () => {
    const stars = [];
    for (let i = 1; i <= 10; i++) {
      stars.push(
        <View key={i} style={{ alignItems: "center", marginHorizontal: 2 }}>
          <TouchableOpacity
            onPress={() => setRating(i)}
            accessible
            accessibilityRole="button"
            accessibilityLabel={`Selecionar nota ${i} de 10`}
            accessibilityHint="Toque duas vezes para escolher esta nota"
          >
            <Ionicons
              name={i <= rating ? "star" : "star-outline"}
              size={30}
              color="#FFD700"
              accessibilityLabel={
                i <= rating ? "Estrela selecionada" : "Estrela não selecionada"
              }
              accessible
            />
          </TouchableOpacity>
          <Text
            style={{ fontSize: 12, color: i === rating ? "#000" : "#777" }}
            accessibilityLabel={`Número ${i}`}
          >
            {i}
          </Text>
        </View>
      );
    }
    return stars;
  };

  async function saveMovie() {
    if (!user) {
      Alert.alert("Acesso restrito", "Faça login para salvar filmes.", [
        { text: "Cancelar", style: "cancel" },
        { text: "Fazer login", onPress: () => router.push("/login") },
      ]);
      return;
    }

    try {
      const movieRef = doc(db, "users", user.uid, "movies", data.id.toString());
      const existing = await getDoc(movieRef);

      if (!existing.exists()) {
        await setDoc(movieRef, {
          title: data.title,
          poster: data.poster_path,
          overview: data.overview,
          rating: rating || null,
          release_date: data.release_date || null,
          createdAt: new Date(),
        });
        Alert.alert("Sucesso", "Filme salvo na sua lista!");
      } else {
        Alert.alert("Aviso", "Esse filme já está na sua lista.");
      }

      setRating(0);
      router.back();
    } catch (error) {
      console.error("Erro ao salvar filme:", error);
      Alert.alert("Erro", "Não foi possível salvar o filme.");
    }
  }

  return (
    <ScrollView
      style={styles.container}
      accessible
      accessibilityLabel={`Detalhes do filme ${data.title}`}
    >
      <TouchableOpacity
        style={styles.backButton}
        onPress={() => router.back()}
        accessible
        accessibilityRole="button"
        accessibilityLabel="Voltar para a tela anterior"
        accessibilityHint="Toque duas vezes para retornar à lista de filmes"
      >
        <Ionicons name="arrow-back" size={28} color="#fff" />
      </TouchableOpacity>

      {/* Banner do filme */}
      <Image
        source={{ uri: `https://image.tmdb.org/t/p/w500${data.poster_path}` }}
        style={styles.poster}
        accessible
        accessibilityLabel={`Pôster do filme ${data.title}`}
      />

      <View style={styles.content}>
        <Text
          style={styles.title}
          accessibilityRole="header"
          accessibilityLabel={`Título: ${data.title}`}
        >
          {data.title}
        </Text>

        {data.release_date && (
          <Text
            style={styles.releaseDate}
            accessibilityLabel={`Data de lançamento: ${new Date(
              data.release_date
            ).toLocaleDateString("pt-BR")}`}
          >
            Data de lançamento:{" "}
            {new Date(data.release_date).toLocaleDateString("pt-BR")}
          </Text>
        )}

        <Text
          style={styles.desc}
          accessibilityLabel={`Descrição: ${data.overview}`}
        >
          {data.overview}
        </Text>

        <Text
          style={{ fontSize: 16, marginBottom: 5 }}
          accessibilityLabel="Dê sua nota para o filme, de 1 a 10 estrelas"
        >
          Dê sua nota:
        </Text>

        <View
          style={{ flexDirection: "row", marginBottom: 15 }}
          accessible
          accessibilityLabel={`Nota selecionada: ${rating || "nenhuma"} de 10`}
        >
          {renderStars()}
        </View>

        <View
          accessible
          accessibilityRole="button"
          accessibilityLabel="Salvar filme na minha lista"
          accessibilityHint="Toque duas vezes para salvar o filme no Firebase"
        >
          <Button title="Salvar na minha lista" onPress={saveMovie} />
        </View>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#fff" },
  backButton: {
    position: "absolute",
    top: 50,
    left: 20,
    zIndex: 10,
    backgroundColor: "rgba(0,0,0,0.5)",
    borderRadius: 50,
    padding: 8,
  },
  poster: {
    width: width,
    height: height * 0.55,
    resizeMode: "cover",
    borderBottomLeftRadius: 20,
    borderBottomRightRadius: 20,
  },
  content: { padding: 20 },
  title: { fontSize: 26, fontWeight: "bold", marginBottom: 10 },
  releaseDate: { fontSize: 16, color: "#333", marginBottom: 10 },
  desc: { marginBottom: 20, color: "#555", lineHeight: 20 },
});
