import { ref } from 'vue';
import axios, { type AxiosError, type AxiosResponse } from 'axios'
import { store } from '@/stores/store'
import type {
  PopularMoviesRequest,
  GenresRequest,
  TMDBPopularMovieResponse,
  TMDBGenresResponse,
  TMDBVideosResponse,
  VideosRequest,
  TMDBVideoByImdbIdResponse,
  VideoByImdbIdRequest,
  ApiErrorResponse,
} from '@/types'

const TMDB_API_KEY = import.meta.env.VITE_TMDB_API_KEY;
const BASE_URL = 'https://api.themoviedb.org/3';

export const useMovies = () => {
  const isPopularMoviesLoading = ref(true);
  const isGenresLoading = ref(true);
  const isVideosLoading = ref(true);
  const isVideoByImdbIdLoading = ref(true);

  const popularMoviesError = ref<string|null>(null);
  const genresError = ref<string|null>(null);
  const videosError = ref<string|null>(null);
  const videoByImdbIdError = ref<string|null>(null);

  const fetchPopularMovies = async (): Promise<TMDBPopularMovieResponse[]> => {
    isPopularMoviesLoading.value = true;
    popularMoviesError.value = null

    const createPopularMovieRequest = (TMDB_API_KEY: string):PopularMoviesRequest => {
      return {
        params: { language: 'en-US' },
        headers: {
          accept: 'application/json',
          Authorization: `Bearer ${TMDB_API_KEY}`,
        },
      }
    }

    try {
      const response: AxiosResponse<TMDBPopularMovieResponse[]> = await axios.get(
        `${BASE_URL}/movie/popular`,
        createPopularMovieRequest(TMDB_API_KEY)
      )

      store.movies = response.data;

      return response.data
    } catch (e) {
      const err = e as AxiosError<ApiErrorResponse>
      popularMoviesError.value = err.response?.data?.error || 'An error occurred while fetching data'
      throw new Error(popularMoviesError.value)
    } finally {
      isPopularMoviesLoading.value = false;
    }
  };

  const fetchGenres = async (): Promise<TMDBGenresResponse> => {
    isGenresLoading.value = true;
    genresError.value = null

    const createGenresRequest = (TMDB_API_KEY: string):GenresRequest => {
      return {
        params: { language: 'en-US' },
        headers: {
          accept: 'application/json',
          Authorization: `Bearer ${TMDB_API_KEY}`,
        },
      }
    }

    try {
      const response: AxiosResponse<TMDBGenresResponse> = await axios.get(
        `${BASE_URL}/genre/movie/list`,
        createGenresRequest(TMDB_API_KEY)
      )

      store.genres = response.data;

      return response.data
    } catch (e) {
      const err = e as AxiosError<ApiErrorResponse>
      genresError.value = err.response?.data?.error || 'An error occurred while fetching data'
      throw new Error(genresError.value)
    } finally {
      isGenresLoading.value = false;
    }
  };

  const fetchVideos = async (movie_id: number): Promise<TMDBVideosResponse> => {
    isVideosLoading.value = true;
    videosError.value = null

    const createVideosRequest = (TMDB_API_KEY: string):VideosRequest => {
      return {
        params: { language: 'en-US' },
        headers: {
          Authorization: `Bearer ${TMDB_API_KEY}`,
        }
      }
    }

    try {
      const response: AxiosResponse<TMDBVideosResponse> = await axios.get(
        `${BASE_URL}/movie/${movie_id}/videos`,
        createVideosRequest(TMDB_API_KEY)
      )

      store.activeMovieVideos = response.data

      return response.data
    } catch (error) {
      const err = error as AxiosError<ApiErrorResponse>
      videosError.value = err.response?.data?.error || 'An error occurred while fetching data'
      throw new Error(videosError.value)
    } finally {
      isVideosLoading.value = false;
    }
  };

  const findVideoByImdbId = async (imdb_id: string): Promise<TMDBVideoByImdbIdResponse> => {
    isVideoByImdbIdLoading.value = true;
    videoByImdbIdError.value = null

    const createVideosRequest = (TMDB_API_KEY: string):VideoByImdbIdRequest => {
      return {
        params: { language: 'en-US' },
        headers: {
          Authorization: `Bearer ${TMDB_API_KEY}`,
        }
      }
    }

    try {
      const response: AxiosResponse<TMDBVideoByImdbIdResponse> = await axios.get(
        `${BASE_URL}/find/${imdb_id}?external_source=imdb_id`,
        createVideosRequest(TMDB_API_KEY)
      )
      console.log('Fetching data from TMDB API')

      return response.data;
    } catch (error) {
      const err = error as AxiosError<ApiErrorResponse>
      videoByImdbIdError.value = err.response?.data?.error || 'An error occurred while fetching data'
      throw new Error(videoByImdbIdError.value)
    } finally {
      isVideoByImdbIdLoading.value = false;
    }
  };

  return {
    isPopularMoviesLoading,
    isGenresLoading,
    isVideosLoading,
    isVideoByImdbIdLoading,
    fetchPopularMovies,
    fetchGenres,
    fetchVideos,
    findVideoByImdbId,
    popularMoviesError,
    genresError,
    videosError,
    videoByImdbIdError,
  };
};
