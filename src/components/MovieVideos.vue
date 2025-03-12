<template>
  <Dialog v-model:visible="computedVisible"
          modal
          class="movie-videos"
          :showHeader="false"
          :closable="false"
          :dismissableMask="true"
          :draggable="false"
          :style="{ width: '90vw' }">
    <div v-if="videoTemplate" v-html="videoTemplate"></div>
  </Dialog>
  <Toast />
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
import { Dialog, Toast } from 'primevue'
import { useToast } from "primevue/usetoast";
import { computed, ref, watch } from 'vue'
import { useAppStore } from '@/stores/app'
import { useI18n } from 'vue-i18n'

const props = defineProps<{ visible: boolean }>()

const appStore = useAppStore()
const toast = useToast();
const { t } = useI18n()
const videoTemplate = ref('')

const emit = defineEmits(["update:visible"])

const computedVisible = computed({
  get: () => props.visible,
  set: (value) => emit("update:visible", value)
})

watch(() => appStore.activeMovie.data,
  (newValue) => {
    if (newValue === null) return
    // store new video data if active movie changed
    const hasSameMovie = appStore.activeMovieVideos.data?.find((el) => el.id === newValue.id)

    if (!hasSameMovie && appStore.activeMovie.data) {
      appStore.getVideosByMovieId(appStore.activeMovie.data?.id)
    }

    // find video by active movie id
    const currentMovieVideos = appStore.activeMovieVideos.data.find((el) => el.id === appStore.activeMovie.data?.id)

    if (!currentMovieVideos) return

    const movieVideoData = currentMovieVideos.results[0]

    // check if video exists
    if (!movieVideoData || !movieVideoData.site) {
      toast.add({ severity: 'warn', summary: t('toast.warn'), detail: t('toast.no_video'), life: 3000 });

      return
    }

    // display video template in dialog
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
})
</script>
