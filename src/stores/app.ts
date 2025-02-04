import { defineStore } from 'pinia'
import { useMovies } from '@/composables/api/useMovies'
import type { AppState } from '@/types'

export const useAppStore = defineStore('app', {
  state: (): AppState => ({
    popularMovies: {
      data: null,
      isLoading: true,
      error: null,
    },
    genres: {
      data: null,
      isLoading: true,
      error: null,
    },
    activeMovie: {
      data: null,
      isLoading: true,
      error: null,
    },
    activeMovieVideos: {
      data: [],
      isLoading: false,
      error: null,
    },
    activeMovieOST: [],
    activeMovieSimilar: {
      data: [],
      isLoading: false,
      error: null,
    },

    aiLoaderText: '',
  }),
  getters: {

  },
  actions: {
    async fetchPopularMovies() {
      const { fetchPopularMovies } = useMovies()

      this.popularMovies.isLoading = true
      this.popularMovies.error = null

      try {
        this.popularMovies.data = await fetchPopularMovies()
      } catch (error) {
        if (error instanceof Error) {
          this.popularMovies.error = error.message
        } else {
          this.popularMovies.error = new Error('An error occurred while fetching data')
        }
      } finally {
        this.popularMovies.isLoading = false
      }
    },
    async fetchGenres() {
      const { fetchGenres } = useMovies()

      this.genres.isLoading = true
      this.genres.error = null

      try {
        this.genres.data = await fetchGenres()
      } catch (error) {
        if (error instanceof Error) {
          this.genres.error = error.message
        } else {
          this.genres.error = new Error('An error occurred while fetching data')
        }
      } finally {
        this.genres.isLoading = false
      }
    },

    async getVideosByMovieId(movieId: number) {
      const { fetchVideos } = useMovies()

      this.activeMovieVideos.isLoading = true
      this.activeMovieVideos.error = null

      try {
        const videos = await fetchVideos(movieId)
        this.$patch((state) => {
          state.activeMovieVideos.data.push(videos)
        })
      } catch (error) {
        if (error instanceof Error) {
          this.popularMovies.error = error.message
        } else {
          this.popularMovies.error = new Error('An error occurred while fetching data')
        }
      } finally {
        this.activeMovieVideos.isLoading = false
      }
    },

    async getActiveMovieGenres(): Promise<void> {
      await this.fetchGenres()

      const ids = Object.values(this.activeMovie.data.genre_ids)

      this.genres.data.genres = this.genres.data.genres.filter((genre) => ids.includes(genre.id));
      this.genres.isLoading = false
    },
  },
  persist: true,
})
