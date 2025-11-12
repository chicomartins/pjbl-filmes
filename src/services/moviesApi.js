import axios from "axios";

const API_KEY = "884e0cad55648266ff424d8956fb3068";
const BASE_URL = "https://api.themoviedb.org/3";

export async function searchMovies(query) {
  if (!query || query.trim() === "") {
    const trendingUrl = `${BASE_URL}/trending/movie/week?api_key=${API_KEY}&language=pt-BR`;
    const response = await axios.get(trendingUrl);
    return response.data.results;
  }

  const searchUrl = `${BASE_URL}/search/movie?api_key=${API_KEY}&language=pt-BR&query=${encodeURIComponent(
    query
  )}`;
  const response = await axios.get(searchUrl);
  return response.data.results;
}
