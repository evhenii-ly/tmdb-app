<template>
  <Dialog
    v-model:visible="computedVisible"
    modal
    class="similar-movies"
    :showHeader="false"
    :closable="false"
    :dismissableMask="true"
    :draggable="false"
    :style="{ width: '80vw' }"
  >
    <div v-if="activeMovieSimilar?.data" class="similar-movies__grid">
      <RouterLink :to="`/movie/${movie.id}`" v-for="movie in activeMovieSimilar.data" :key="movie.id" class="similar-card-box">
        <Card class="similar-card">
          <template #header>
            <img alt="user header" :src="`https://image.tmdb.org/t/p/w300${movie.poster_path}`" />
            <span class="similar-card__title">{{ movie.title }}</span>
          </template>
        </Card>
      </RouterLink>
    </div>
  </Dialog>
</template>

<style lang="scss">
.similar-movies {
  &__grid {
    display: grid;
    grid-template-columns: repeat(5, 1fr);
    grid-gap: 16px;
    margin-top: 20px;
  }

  .p-card-body {
    display: none;
  }

  .similar-card-box {
    display: flex;
    border-radius: 12px;
    overflow: hidden;
  }

  .similar-card {
    &:hover {
      img {
        transform: scale(1.1);
      }

      &::after {
        opacity: 1;
      }
    }

    &::before,
    &::after {
      content: '';
      position: absolute;
      top: 0;
      left: 0;
      z-index: 1;
      width: 100%;
      height: 100%;
      background: rgb(0, 0, 0);
      background: linear-gradient(0deg, rgba(0, 0, 0, 1) 10%, rgba(0, 0, 0, 0) 80%);
      transition: opacity 0.4s;
    }

    &::after {
      opacity: 0;
      background: linear-gradient(0deg, rgba(0, 0, 0, 1) 10%, rgba(0, 0, 0, 0) 100%);
    }

    img {
      width: 100%;
      height: 100%;
      object-fit: cover;
      transform: scale(1);
      transition: transform 0.5s;
    }

    &__title {
      position: absolute;
      left: 0;
      bottom: 0;
      z-index: 2;
      width: 100%;
      padding: 16px;
      font-size: 20px;
      font-weight: 700;
      line-height: 1.2;
    }
  }
}
</style>

<script setup lang="ts">
import { Dialog, Card } from 'primevue'
import { computed, ref, watch } from 'vue'
import { store } from '@/stores/store'
import { useAppStore } from '@/stores/app'

const props = defineProps<{ visible: boolean }>()

const appStore = useAppStore()
const videoTemplate = ref('')

const emit = defineEmits(["update:visible"])

const computedVisible = computed({
  get: () => props.visible,
  set: (value) => emit("update:visible", value)
})

const activeMovieSimilar = computed(() => appStore.activeMovieSimilar.data?.find((el) => el.id === appStore.activeMovie.data?.id))

watch(
  () => appStore.activeMovieSimilar.data,
  (newValue) => {
    // appStore.activeMovieSimilar.data = newValue
  },
)

// watch(
//   () => store.activeMovieVideos,
//   (newValue) => {
//     const movieVideoData = newValue.results[0]
//
//     switch (movieVideoData.site) {
//       case 'YouTube':
//         videoTemplate.value = `<iframe width="100%"
//             height="100%"
//             class="movie-videos__iframe"
//             src="https://www.youtube.com/embed/${movieVideoData.key}?controls=0&rel=0"
//             title="YouTube video player"
//             frameborder="0"
//             allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
//             referrerpolicy="strict-origin-when-cross-origin"
//             allowfullscreen></iframe>`
//     }
//   },
// )
</script>
