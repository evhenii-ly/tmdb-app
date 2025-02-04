import type {
  TMDBGenresResponse,
  TMDBMovie,
  TMDBPopularMovieResponse,
  TMDBVideosResponse,
} from '@/types'

export interface AppState {
  popularMovies: {
    data: TMDBPopularMovieResponse | null
    isLoading: boolean
    error: null | string | Error
  }
  genres: {
    data: TMDBGenresResponse | null
    isLoading: boolean
    error: null | string | Error
  },
  activeMovie: {
    data: TMDBMovie | null
    isLoading: boolean
    error: null | string | Error
  },
  activeMovieVideos: {
    data: TMDBVideosResponse[]
    isLoading: boolean
    error: null | string | Error
  },
  activeMovieOST: MovieOST[] | []
  activeMovieSimilar: {
    data: MovieCollection[]
    isLoading: boolean
    error: null | string | Error
  }
  aiLoaderText: string
}

export interface MovieCollection {
  id: number
  data: Movie[] | null
}
