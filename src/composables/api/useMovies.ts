import axios, { type AxiosError, type AxiosResponse } from 'axios'
import { store } from '@/stores/store.ts'
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
  const fetchPopularMovies = async (): Promise<TMDBPopularMovieResponse> => {
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
      const response: AxiosResponse<TMDBPopularMovieResponse> = await axios.get(
        `${BASE_URL}/movie/popular`,
        createPopularMovieRequest(TMDB_API_KEY)
      )

      return response.data
    } catch (e) {
      const err = e as AxiosError<ApiErrorResponse>
      const popularMoviesError = err.response?.data?.error || 'An error occurred while fetching data'
      throw new Error(popularMoviesError)
    }
  };

  const fetchGenres = async (): Promise<TMDBGenresResponse> => {
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

      return response.data
    } catch (e) {
      const err = e as AxiosError<ApiErrorResponse>
      const genresError = err.response?.data?.error || 'An error occurred while fetching data'
      throw new Error(genresError)
    }
  };

  const fetchVideos = async (movieId: number): Promise<TMDBVideosResponse> => {
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
        `${BASE_URL}/movie/${movieId}/videos`,
        createVideosRequest(TMDB_API_KEY)
      )

      return response.data
    } catch (error) {
      const err = error as AxiosError<ApiErrorResponse>
      const videosError = err.response?.data?.error || 'An error occurred while fetching data'
      throw new Error(videosError)
    }
  };

  const findVideoByImdbId = async (imdb_id: string): Promise<TMDBVideoByImdbIdResponse> => {
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
      const videoByImdbIdError = err.response?.data?.error || 'An error occurred while fetching data'
      throw new Error(videoByImdbIdError)
    }
  };

  return {
    fetchPopularMovies,
    fetchGenres,
    fetchVideos,
    findVideoByImdbId,
  };
};
