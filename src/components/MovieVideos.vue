<template>
  <Dialog v-model:visible="visible"
          modal
          class="movie-videos"
          :showHeader="false"
          :closable="false"
          :dismissableMask="true"
          :draggable="false"
          :style="{ width: '90vw' }">
    <div v-if="videoTemplate" v-html="videoTemplate"></div>
  </Dialog>
</template>

<style lang="scss">
.p-dialog.movie-videos {
  max-height: 90vh;
  box-shadow: none;
  background: none;
  border: none;

  .movie-videos__iframe {
    height: 88vh;
  }

  .p-dialog-content {
    padding: 0;
  }
}
</style>

<script setup lang="ts">
import { Dialog } from 'primevue'
import { ref, watch } from 'vue'
import { useMovies } from '@/composables/useMovies'
import { store } from '@/stores/store'
const { fetchVideos } = useMovies();

const visible = ref(false);
const videoTemplate = ref('');

watch(
  () => store.activeSlideData,
  (newValue) => {
    fetchVideos(newValue.id)
  },
)

watch(
  () => store.activeMovieVideos,
  (newValue) => {
    const movieVideoData = newValue.results[0]

    switch (movieVideoData.site) {
      case 'YouTube':
        videoTemplate.value =
          `<iframe width="100%"
            height="100%"
            class="movie-videos__iframe"
            src="https://www.youtube.com/embed/${movieVideoData.key}?controls=0&rel=0"
            title="YouTube video player"
            frameborder="0"
            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
            referrerpolicy="strict-origin-when-cross-origin"
            allowfullscreen></iframe>`
    }
  },
)
</script>
