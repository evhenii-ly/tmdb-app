<template>
  <div class="popular-movies">
    <template v-if="store.activeSlideComputed">
      <img
        :src="`https://image.tmdb.org/t/p/original${store.activeSlideComputed.backdrop_path}`"
        class="popular-movies__backdrop"
        alt="Backdrop" />
    </template>

    <template v-if="isPopularMoviesLoading">
      <Skeleton width="470px" height="4rem" borderRadius="16px"></Skeleton>
      <Skeleton width="100%" height="8rem" borderRadius="16px"></Skeleton>
    </template>

    <template v-else>
      <MovieInfoCard />
      <MovieSlider :items="store.movies.results" class="movie-slider" />
    </template>
  </div>
</template>

<style lang="scss">
.popular-movies {
  position: relative;
  display: flex;
  flex-direction: column;
  flex: 1;
  padding-top: 40px;
  padding-bottom: 80px;
  background: rgb(0, 0, 0);
  background: linear-gradient(90deg, rgba(0,0,0,1) 0%, rgba(0,0,0,1) 35%, rgba(0,0,0,0) 70%);

  &::before {
    content: '';
    position: absolute;
    z-index: -1;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    background: rgb(0, 0, 0);
    background: linear-gradient(180deg, rgba(0, 0, 0, 1) 0%, rgba(0, 0, 0, 0) 30%);
    pointer-events: none;
  }

  &__backdrop {
    position: absolute;
    top: 0;
    left: 0;
    z-index: -2;
    width: 100%;
    height: 100%;
    object-fit: cover;
  }
}
</style>

<script setup>
import { Skeleton } from 'primevue'
import MovieSlider from '@/components/MovieSlider.vue'
import MovieInfoCard from '@/components/MovieInfoCard.vue'
import { onMounted } from 'vue'
import { useMovies } from '@/composables/useMovies'
import { store } from '@/stores/store'

const { isPopularMoviesLoading, fetchPopularMovies } = useMovies()

onMounted(() => {
  fetchPopularMovies()
})
</script>
