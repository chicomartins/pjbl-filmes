import React, { useEffect, useState } from "react";
import { View, Text, Image, FlatList, StyleSheet, Dimensions } from "react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { useAuth } from "../../src/context/AuthContext";

export default function MyMovies() {
  const { user } = useAuth();
  const [movies, setMovies] = useState([]);
  const numColumns = 2;
  const imageWidth = Dimensions.get("window").width / numColumns - 24;

  // Carrega os filmes salvos do usuário
  useEffect(() => {
    async function loadMovies() {
      try {
        const stored = await AsyncStorage.getItem("@myMovies");
        if (stored) {
          const allMovies = JSON.parse(stored);
          // Filtra apenas os filmes do usuário logado (por e-mail)
          const userMovies = allMovies.filter((m) => m.userEmail === user?.email);
          setMovies(userMovies);
        }
      } catch (e) {
        console.error("Erro ao carregar filmes:", e);
      }
    }
    if (user) loadMovies();
  }, [user]);

  const renderItem = ({ item }) => (
    <View style={[styles.card, { width: imageWidth }]}>
      <Image
        source={{ uri: item.poster }}
        style={styles.poster}
        resizeMode="cover"
      />
      <Text style={styles.title} numberOfLines={1}>
        {item.title}
      </Text>
      <Text style={styles.rating}>⭐ {item.rating}</Text>
    </View>
  );

  return (
    <View style={styles.container}>
      <Text style={styles.header}>Meus Filmes 🎥</Text>

      {!user ? (
        <Text style={styles.noUser}>Faça login para ver seus filmes.</Text>
      ) : movies.length === 0 ? (
        <Text style={styles.noMovies}>Você ainda não avaliou nenhum filme.</Text>
      ) : (
        <FlatList
          data={movies}
          renderItem={renderItem}
          keyExtractor={(item) => item.id}
          numColumns={numColumns}
          contentContainerStyle={styles.list}
          showsVerticalScrollIndicator={false}
        />
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#fff", paddingTop: 20 },
  header: {
    fontSize: 24,
    fontWeight: "bold",
    textAlign: "center",
    marginBottom: 10,
    color: "#e50914",
  },
  list: {
    paddingHorizontal: 12,
    paddingBottom: 20,
  },
  card: {
    margin: 6,
    backgroundColor: "#f9f9f9",
    borderRadius: 10,
    alignItems: "center",
    overflow: "hidden",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 3,
    elevation: 2,
  },
  poster: {
    width: "100%",
    height: 200,
    borderTopLeftRadius: 10,
    borderTopRightRadius: 10,
  },
  title: {
    fontSize: 16,
    fontWeight: "600",
    marginTop: 5,
    textAlign: "center",
    color: "#333",
  },
  rating: {
    fontSize: 14,
    marginBottom: 8,
    color: "#666",
  },
  noUser: {
    textAlign: "center",
    marginTop: 50,
    fontSize: 16,
    color: "#555",
  },
  noMovies: {
    textAlign: "center",
    marginTop: 50,
    fontSize: 16,
    color: "#999",
  },
});
