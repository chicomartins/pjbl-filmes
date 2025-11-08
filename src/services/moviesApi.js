import axios from "axios";

// Pegue sua API Key no site: https://developer.themoviedb.org
const API_KEY = "884e0cad55648266ff424d8956fb3068";

export async function searchMovies(query) {
  if (!query) return [];

  const url = `https://api.themoviedb.org/3/search/movie?api_key=${API_KEY}&language=pt-BR&query=${query}`;

  const response = await axios.get(url);
  return response.data.results;
}
