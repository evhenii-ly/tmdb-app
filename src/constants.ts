export const GEMINI_PROMPT_SIMILAR_MOVIES = (title: string, release_date: string): string =>
  `List of IMDb movies links similar to ${title} (${release_date}) using this JSON
  schema: Movie = "title": string, "imdb_link": string Return: Array Movie. Must be 10 items.
  The answer must contains only JSON.`

export const GEMINI_PROMPT_MOVIE_OST = (title: string, release_date: string): string =>
  `List of full OST from movie ${title} (${release_date}) from spotify using this JSON
  schema : Song = "track_name": string, "artist": string Return: Array Song.
  You can use Wikipedia to find the full list of OST. The answer must contains only JSON.`
