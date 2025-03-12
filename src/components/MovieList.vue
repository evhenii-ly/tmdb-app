<template>
  <div class="MovieList">
    <MovieCard
      v-for="movie in store.movies.results"
      :key="movie.id"
      :title="movie.title"
      :content="movie.overview"
      :image="movie.poster_path"
      :link="movie.id"
      :date="movie.release_date"
      :rating="movie.vote_average"
    />
  </div>

  <Paginator
    @page="
      (event) => {
        store.currentPage = event.page + 1
        fetchPopularMovies()
      }
    "
    :rows="20"
    :totalRecords="store.movies.total_results"
  >
  </Paginator>
</template>

<style lang="scss">
.MovieList {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(200px, 1fr));
  grid-gap: 16px;
}
</style>

<script setup lang="ts">
import { Paginator } from 'primevue'
import MovieCard from '@/components/MovieCard.vue'
import { useMovies } from '@/composables/api/useMovies'
import { store } from '@/stores/store'
import { onMounted } from 'vue'

const { fetchPopularMovies } = useMovies()

onMounted(() => {
  fetchPopularMovies()
})
</script>
