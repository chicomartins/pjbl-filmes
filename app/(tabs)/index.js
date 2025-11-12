import React, { useState, useEffect } from "react";
import {
  View,
  TextInput,
  Text,
  FlatList,
  Image,
  TouchableOpacity,
  StyleSheet,
} from "react-native";
import { searchMovies } from "../../src/services/moviesApi";
import { useRouter } from "expo-router";

export default function SearchScreen() {
  const [query, setQuery] = useState("");
  const [movies, setMovies] = useState([]);
  const router = useRouter();

  useEffect(() => {
    handleSearch("");
  }, []);

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
    <View
      style={styles.container}
      accessible
      accessibilityLabel="Tela de busca de filmes"
    >
      <Text
        style={styles.title}
        accessibilityRole="header"
        accessibilityLabel="Filmes em alta"
      >
        🎬 Filmes em Alta
      </Text>

      <TextInput
        style={styles.input}
        placeholder="Buscar filme..."
        value={query}
        onChangeText={handleSearch}
        accessibilityLabel="Campo de busca de filmes"
        accessibilityHint="Digite o nome de um filme para pesquisar"
        accessibilityRole="search"
      />

      <FlatList
        data={movies}
        keyExtractor={(item) => item.id.toString()}
        accessibilityLabel="Lista de filmes"
        renderItem={({ item }) => (
          <TouchableOpacity
            style={styles.card}
            onPress={() => openDetails(item)}
            accessible
            accessibilityRole="button"
            accessibilityLabel={`Abrir detalhes do filme ${item.title}`}
            accessibilityHint="Toque duas vezes para abrir os detalhes do filme"
          >
            <Image
              source={{
                uri: `https://image.tmdb.org/t/p/w200${item.poster_path}`,
              }}
              style={styles.poster}
              accessibilityLabel={`Pôster do filme ${item.title}`}
              accessible
            />
            <View style={{ flex: 1 }}>
              <Text style={styles.name} accessibilityLabel={`Título: ${item.title}`}>
                {item.title}
              </Text>
              <Text
                numberOfLines={2}
                style={styles.desc}
                accessibilityLabel={`Descrição: ${item.overview}`}
              >
                {item.overview}
              </Text>
            </View>
          </TouchableOpacity>
        )}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, padding: 20, backgroundColor: "#fff" },
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
  poster: {
    width: 60,
    height: 90,
    borderRadius: 8,
    marginRight: 10,
  },
  name: { fontSize: 16, fontWeight: "bold" },
  desc: { color: "#555", marginTop: 4 },
});
