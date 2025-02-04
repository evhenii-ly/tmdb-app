<template>
  <div class="popular-movies">
    <template v-if="appStore.activeMovie.data">
      <img
        :src="`https://image.tmdb.org/t/p/w92${appStore.activeMovie.data.backdrop_path}`"
        :data-srcset="`https://image.tmdb.org/t/p/original${appStore.activeMovie.data.backdrop_path}`"
        class="popular-movies__backdrop lazyload"
        alt="Backdrop" />
    </template>

    <template v-if="appStore.popularMovies.isLoading">
      <Skeleton width="470px" height="4rem" borderRadius="16px"></Skeleton>
      <Skeleton width="100%" height="8rem" borderRadius="16px"></Skeleton>
    </template>

    <template v-else>
      <MovieInfoCard />
      <MovieSlider :items="appStore.popularMovies.data?.results ?? null" class="movie-slider" />
    </template>
  </div>
</template>

<style lang="scss" scoped>
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
    filter: blur(40px);
    transition: filter 1s;

    &.lazyloaded {
      filter: blur(0);
    }
  }
}
</style>

<script setup lang="ts">
import { onMounted } from 'vue'
import { Skeleton } from 'primevue'
import { useAppStore } from '@/stores/app'
import MovieSlider from '@/components/MovieSlider.vue'
import MovieInfoCard from '@/components/MovieInfoCard.vue'

const appStore = useAppStore()

onMounted(() => {
  appStore.fetchPopularMovies()
})
</script>
