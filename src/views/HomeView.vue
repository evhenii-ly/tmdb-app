<script setup>

import PopularMovies from '@/views/PopularMovies.vue'
</script>

<template>
  <main>
    <PopularMovies class="popular-movies" />
  </main>
</template>

<style lang="scss">
main {
  display: flex;
  flex-direction: column;
  flex: 1;
}
</style>
