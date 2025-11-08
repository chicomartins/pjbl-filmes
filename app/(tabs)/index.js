import React, { useState } from "react";
import { View, TextInput, Text, FlatList, Image, TouchableOpacity, StyleSheet } from "react-native";
import { searchMovies } from "../../src/services/moviesApi";
import { useRouter } from "expo-router";

export default function SearchScreen() {
  const [query, setQuery] = useState("");
  const [movies, setMovies] = useState([]);
  const router = useRouter();

  async function handleSearch(text) {
    setQuery(text);
    const results = await searchMovies(text);
    setMovies(results);
  }

  function openDetails(movie) {
    router.push({
      pathname: "/movie-detail",
      params: { movie: JSON.stringify(movie) },
    });
  }

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Buscar Filmes 🎬</Text>

      <TextInput
        style={styles.input}
        placeholder="Digite o nome do filme..."
        value={query}
        onChangeText={handleSearch}
      />

      <FlatList
        data={movies}
        keyExtractor={(item) => item.id.toString()}
        renderItem={({ item }) => (
          <TouchableOpacity style={styles.card} onPress={() => openDetails(item)}>
            <Image
              source={{ uri: `https://image.tmdb.org/t/p/w200${item.poster_path}` }}
              style={styles.poster}
            />
            <View style={{ flex: 1 }}>
              <Text style={styles.name}>{item.title}</Text>
              <Text numberOfLines={2} style={styles.desc}>{item.overview}</Text>
            </View>
          </TouchableOpacity>
        )}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, padding: 20 },
  title: { fontSize: 24, fontWeight: "bold", marginBottom: 15 },
  input: {
    borderWidth: 1,
    borderColor: "#ccc",
    padding: 10,
    borderRadius: 8,
    marginBottom: 15,
  },
  card: {
    flexDirection: "row",
    marginBottom: 15,
    backgroundColor: "#f3f3f3",
    padding: 10,
    borderRadius: 10,
  },
  poster: { width: 60, height: 90, borderRadius: 8, marginRight: 10 },
  name: { fontSize: 16, fontWeight: "bold" },
  desc: { color: "#555", marginTop: 4 },
});
