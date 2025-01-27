<template>
  <div class="Movie">
    <div class="backdrop">
      <Image :src="`https://image.tmdb.org/t/p/original/${movie.backdrop_path}`" imageClass="backdrop-image" />
    </div>

    <Image :src="`https://image.tmdb.org/t/p/w500/${movie.poster_path}`" />

    <Chip :label="movie.status" />

    <h1>{{ movie.title }}</h1>
    <p>{{ movie.overview }}</p>

    <Rating
      :modelValue="movie.vote_average"
      :stars="10"
      readonly
    />

    <span>({{  movie.vote_count }} votes)</span>

    <div class="country-list">
      <span
        v-for="country in movie.production_countries"
        class="country-item">
      <span v-html="CountryFlagSvg[country.iso_3166_1]" class="flag"></span>
      {{ country.name }}
    </span>
    </div>
  </div>
</template>

<style lang="scss">
.backdrop {
  width: 100%;
  height: 300px;
}

.backdrop-image {
  width: 100%;
  height: 100%;
  object-fit: cover;
}

.country-list {
  display: flex;
  gap: 10px;
}

.country-item {
  display: flex;
  gap: 5px;
}

.flag {
  display: flex;
  width: 30px;
}
</style>

<script setup lang="ts">
import { onMounted, ref } from 'vue'
import {
  Image,
  Rating,
  Chip,
} from 'primevue';
import CountryFlagSvg from 'country-list-with-dial-code-and-flag/dist/flag-svg'

const movie = ref({});
const isMovieFetched = ref(false);

onMounted(() => {
  const id = Number(window.location.pathname.split("/")[2]);


  // getMovieById(id);
})
</script>
