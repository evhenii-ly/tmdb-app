export interface TMDBPopularMovieResponse {
  page: number,
  results: TMDBMovie[],
  total_pages: number,
  total_results: number
}

export interface TMDBGenresResponse {
  genres: Genre[]
}

export interface Genre {
  id: number,
  name: string
}

export interface TMDBVideosResponse {
  id: number,
  results: TMDBVideo[]
}

export interface TMDBVideoByImdbIdResponse {
  movie_results: TMDBMovieByExternalId[]
  person_results: []
  tv_results: []
  tv_episode_results: []
  tv_season_results: []
}

export interface TMDBVideo {
  id: string,
  iso_3166_1: string,
  iso_639_1: string,
  key: string,
  name: string,
  official: boolean,
  published_at: string,
  site: string,
  size: number,
  type: string
}

export interface TMDBMovie {
  adult: boolean,
  backdrop_path: string,
  genre_ids: number[],
  id: number,
  original_language: string,
  original_title: string,
  overview: string,
  popularity: number,
  poster_path: string,
  release_date: string,
  title: string,
  video: boolean,
  vote_average: number,
  vote_count: number
}

export interface TMDBMovieByExternalId extends TMDBMovie {
  media_type: string,
}

export interface PopularMoviesRequest {
  params: {
    language?: string
    page?: number
    region?: string
  }
  headers: {
    accept: string
    Authorization: string
  }
}

export interface GenresRequest {
  params: {
    language?: string
  }
  headers: {
    accept: string
    Authorization: string
  }
}

export interface VideosRequest {
  params: {
    language?: string
  }
  headers: {
    accept?: string
    Authorization: string
  }
}

export interface VideoByImdbIdRequest {
  params: {
    language?: string
  }
  headers: {
    accept?: string
    Authorization: string
  }
}
