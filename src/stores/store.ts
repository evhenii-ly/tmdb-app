import { reactive } from 'vue'
import type {
  TMDBGenresResponse,
  TMDBPopularMovieResponse,
  TMDBVideosResponse
} from '@/types/composables/useMovies.types.ts'

export const store = reactive({
  movies: <TMDBPopularMovieResponse[]>[],
  genres: <TMDBGenresResponse>{},
  activeSlideData: <Movie>{},
  activeMovieVideos: <TMDBVideosResponse>{},
  activeMovieOST: <MovieOST[]>[],
  similarMovies: <Movie[]>[],
  currentPage: 1,

  get activeSlideComputed() {
    return this.activeSlideData
  },
})
