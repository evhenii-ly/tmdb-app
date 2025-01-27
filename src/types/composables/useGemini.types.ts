export type GeminiPrompt = 'similar_movies' | 'movie_ost';

export interface GeminiRequest {
  contents: Array<{
    parts: Array<{
      text: string
    }>
  }>
}

export interface GeminiResponse {
  candidates: Array<{
    content: {
      parts: Array<{
        text: string
      }>
    }
  }>
}

export interface ApiErrorResponse {
  error: string;
}

export interface GeminiSimilarMoviesResponse {
  title: string
  imdb_link: string
}

export interface GeminiMovieOSTResponse {
  track_name: string
  artist: string
}
