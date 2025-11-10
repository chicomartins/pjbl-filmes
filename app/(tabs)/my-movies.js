import React, { useEffect, useState } from "react";
import { View, Text, FlatList, Image, StyleSheet, TouchableOpacity } from "react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { useAuth } from "../../src/context/AuthContext";
import { useRouter } from "expo-router";

export default function MyMovies() {
  const { user } = useAuth();
  const router = useRouter();
  const [movies, setMovies] = useState([]);

  useEffect(() => {
    if (!user) {
      router.replace("/login");
      return;
    }

    async function loadMovies() {
      const key = `@movies_${user.email}`;
      const stored = await AsyncStorage.getItem(key);
      setMovies(stored ? JSON.parse(stored) : []);
    }

    loadMovies();
  }, [user]);

  if (!user) {
    return null;
  }

  return (
    <View style={styles.container}>
      {movies.length === 0 ? (
        <Text style={styles.emptyText}>Você ainda não salvou nenhum filme.</Text>
      ) : (
        <FlatList
          data={movies}
          numColumns={2}
          keyExtractor={(item) => item.id.toString()}
          renderItem={({ item }) => (
            <View style={styles.card}>
              <Image
                source={{ uri: `https://image.tmdb.org/t/p/w300${item.poster}` }}
                style={styles.poster}
              />
              <Text style={styles.title}>{item.title}</Text>
              <Text style={styles.rating}>⭐ {item.rating || "Sem nota"}</Text>
            </View>
          )}
        />
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, padding: 10, backgroundColor: "#fff" },
  emptyText: { textAlign: "center", marginTop: 50, fontSize: 16, color: "#666" },
  card: {
    flex: 1,
    margin: 5,
    backgroundColor: "#f5f5f5",
    borderRadius: 10,
    padding: 10,
    alignItems: "center",
  },
  poster: { width: 150, height: 220, borderRadius: 10 },
  title: {
    fontSize: 14,
    fontWeight: "600",
    marginTop: 8,
    textAlign: "center",
  },
  rating: { color: "#e50914", marginTop: 4, fontWeight: "bold" },
});
