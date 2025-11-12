import React, { useState, useCallback } from "react";
import { View, Text, FlatList, StyleSheet, Image } from "react-native";
import { useFocusEffect, useRouter } from "expo-router";
import { collection, getDocs } from "firebase/firestore";
import { useAuth } from "../../src/context/AuthContext";
import { db } from "../../src/services/firebaseConfig";

export default function MyMovies() {
  const { user } = useAuth();
  const router = useRouter();
  const [movies, setMovies] = useState([]);

  useFocusEffect(
    useCallback(() => {
      if (!user) {
        router.replace("/login");
      }
    }, [user])
  );

  useFocusEffect(
    useCallback(() => {
      async function loadMovies() {
        if (!user) return;
        try {
          const moviesRef = collection(db, "users", user.uid, "movies");
          const snapshot = await getDocs(moviesRef);
          const list = snapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() }));
          setMovies(list);
        } catch (error) {
          console.error("Erro ao carregar filmes:", error);
        }
      }
      loadMovies();
    }, [user])
  );

  if (!user) return null;

  return (
    <View style={styles.container} accessible accessibilityLabel="Tela de meus filmes">
      <Text style={styles.title} accessibilityRole="header">
        🎬 Meus Filmes
      </Text>

      {movies.length === 0 ? (
        <Text style={styles.empty} accessibilityLabel="Nenhum filme salvo ainda">
          Nenhum filme salvo ainda 😔
        </Text>
      ) : (
        <FlatList
          data={movies}
          keyExtractor={(item) => item.id.toString()}
          numColumns={2}
          columnWrapperStyle={{ justifyContent: "space-between" }}
          showsVerticalScrollIndicator={false}
          renderItem={({ item }) => (
            <View
              style={styles.card}
              accessible
              accessibilityLabel={`Filme: ${item.title}. Avaliação: ${item.rating || "sem nota"}`}
            >
              <Image
                source={{ uri: `https://image.tmdb.org/t/p/w200${item.poster}` }}
                style={styles.poster}
                accessibilityLabel={`Pôster do filme ${item.title}`}
              />
              <Text style={styles.name} numberOfLines={2}>
                {item.title}
              </Text>
              <Text style={styles.rating}>⭐ {item.rating || "Sem nota"}</Text>
            </View>
          )}
        />
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, padding: 20, backgroundColor: "#fff" },
  title: { fontSize: 22, fontWeight: "bold", marginBottom: 20, textAlign: "center" },
  empty: { marginTop: 40, textAlign: "center", fontSize: 16, color: "#666" },
  card: {
    width: "48%",
    backgroundColor: "#f4f4f4",
    borderRadius: 10,
    marginBottom: 15,
    padding: 10,
    alignItems: "center",
  },
  poster: { width: 100, height: 150, borderRadius: 8, marginBottom: 10 },
  name: { fontWeight: "bold", fontSize: 14, textAlign: "center" },
  rating: { color: "#555", marginTop: 5 },
});
