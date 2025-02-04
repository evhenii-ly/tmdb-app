<template>
  <Skeleton
    v-if="appStore.activeMovie.isLoading"
    width="470px"
    height="4rem"
    borderRadius="16px"
  ></Skeleton>
  <div v-else class="container movie-info">
    <h1 class="movie-info__title">{{ appStore.activeMovie.data?.title }}</h1>
    <div class="movie-info__content">
      <div class="movie-info__details">
        <div class="movie-info__imdb">
          <IconImdb />

          <span class="movie-info__imdb-average">{{ voteAverageRounded() }}&nbsp;</span>
          <span class="movie-info__imdb-count">({{ appStore.activeMovie.data?.vote_count }})</span>
        </div>
        <div class="movie-info__year movie-info__item">{{ getReleaseYearFromDate() }}</div>
        <div class="movie-info__genres">
          <template v-if="!appStore.genres.isLoading">
            <span v-for="(genre, index) in appStore.genres.data?.genres" :key="genre">
              {{ genre.name
              }}<template
                v-if="
                  appStore.genres.data?.genres && index < appStore.genres.data.genres.length - 1
                "
                >,&nbsp;</template
              >
            </span>
          </template>
        </div>
      </div>
      <p class="movie-info__description">
        {{ getOverviewShort() }}
        <RouterLink
          :to="`/movie/${appStore.activeMovie.data?.id}`"
          v-bind="{ 'data-text': 'See more' }"
          >See more
        </RouterLink>
      </p>

      <div class="movie-info__buttons">
        <Button variant="outlined" severity="secondary" @click="isMovieVideosModalVisible = true">
          Watch trailer
        </Button>
        <Button @click="getOST"> Watch now </Button>

        <Button
          variant="outlined"
          severity="secondary"
          class="movie-info__similar"
          @click="handleFindSimilarMovies"
        >
          <IconMagicWand />
          Similar with AI
        </Button>
      </div>
    </div>
  </div>

  <SpotifyPlayer />

  <MovieVideos v-model:visible="isMovieVideosModalVisible" />
  <SimilarMovies v-model:visible="isSimilarMoviesModalVisible" />
  <AiLoader :visible="isAiLoaderVisible" :text="appStore.aiLoaderText" />
</template>

<style lang="scss">
.movie-info {
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: flex-start;
  flex: 1;
  height: 345px;

  &__details {
    display: flex;
    align-items: center;
    flex-wrap: wrap;
    margin-bottom: 24px;
  }

  &__imdb {
    position: relative;
    display: flex;
    align-items: center;
    margin-right: 28px;
    color: #fff;

    &::after {
      content: '';
      position: absolute;
      top: 50%;
      right: -16px;
      width: 4px;
      height: 4px;
      background-color: #fff;
      transform: translateY(-50%);
      border-radius: 50%;
      opacity: 0.8;
    }
  }

  &__item {
    position: relative;
    margin-right: 16px;

    &::after {
      content: '';
      position: absolute;
      top: 50%;
      right: -8px;
      width: 1px;
      height: 10px;
      background-color: #fff;
      transform: translateY(-50%);
      opacity: 0.5;
    }
  }

  &__imdb-icon {
    margin-right: 8px;
  }

  &__imdb-average {
    opacity: 0.8;
  }

  &__imdb-count {
    opacity: 0.4;
  }

  &__genres {
    display: contents;
  }

  &__content {
    max-width: 470px;
  }

  &__title {
    max-width: 500px;
    margin-bottom: 24px;
    color: #f7f7f7;
    font-weight: 700;
    font-size: 72px;
    line-height: 1.1;
  }

  &__description {
    display: -webkit-box;
    -webkit-box-orient: vertical;
    -webkit-line-clamp: 3;
    margin-bottom: 40px;
    color: #f7f7f7;
    overflow: hidden;

    a {
      color: var(--p-primary-color);
    }
  }

  &__buttons {
    display: flex;
    gap: 16px;
  }

  &__similar.p-button {
    position: relative;
    color: #fff;
    border: none !important;
    box-shadow: 0 0 9px 6px transparent;
    transition: box-shadow 0.4s;

    &:before,
    &:after {
      content: '';
      position: absolute;
      inset: 0;
      padding: 1px; /* border length  */
      background: linear-gradient(45deg, #33eeff, #9b12ff);
      border-radius: inherit;
      mask:
        conic-gradient(#000 0 0) content-box exclude,
        conic-gradient(#000 0 0);
      transition: all 0.4s;
    }

    &::after {
      background: linear-gradient(45deg, #9b12ff, #33eeff);
      opacity: 0;
    }

    svg {
      transform-origin: bottom left;
    }

    &:hover {
      border: none;
      box-shadow:
        0 0 8px 1px rgba(51, 238, 255, 0.4),
        0 0 14px 4px rgba(155, 18, 255, 0.3);

      svg {
        animation: wand-shake 0.7s ease;
      }

      &:after {
        opacity: 1;
      }
    }
  }
}

@keyframes wand-shake {
  0%,
  100% {
    transform: rotate(0);
  }

  33% {
    transform: rotate(4deg);
  }

  66% {
    transform: rotate(-7deg);
  }
}
</style>

<script setup lang="ts">
import { onMounted, ref, watch } from 'vue'
import { Button, Skeleton } from 'primevue'
import IconImdb from '@/components/icons/IconImdb.vue'
import IconMagicWand from '@/components/icons/IconMagicWand.vue'
import { useGemini } from '@/composables/api/useGemini'
import { useSpotify } from '@/composables/api/useSpotify'
import MovieVideos from '@/components/MovieVideos.vue'
import SimilarMovies from '@/components/SimilarMovies.vue'
import AiLoader from '@/components/AiLoader.vue'
import SpotifyPlayer from '@/components/SpotifyPlayer.vue'
import type { TMDBMovieByExternalId } from '@/types'
import { useAppStore } from '@/stores/app'
import { useI18n } from 'vue-i18n'
import { useMovies } from '@/composables/api/useMovies.ts'

const { findVideoByImdbId } = useMovies()
const { sendMessageToGemini } = useGemini()
const { searchTrackByName } = useSpotify()
const appStore = useAppStore()

const getReleaseYearFromDate = (): number | NA =>
  appStore.activeMovie.data?.release_date
    ? new Date(appStore.activeMovie.data.release_date).getFullYear()
    : 'N/A'

const getOverviewShort = (): string => {
  const overview = appStore.activeMovie.data?.overview || ''

  return overview.length > 170 ? overview.slice(0, 170).trim() + '...' : overview
}

const voteAverageRounded = (): string => Number(appStore.activeMovie.data?.vote_average).toFixed(1)

const { t } = useI18n()
const isMovieVideosModalVisible = ref(false)
const isSimilarMoviesModalVisible = ref(false)
const isAiLoaderVisible = ref(false)

const handleFindSimilarMovies = async () => {
  // check if movie id is existing
  const hasSameMovie = appStore.activeMovieSimilar.data?.find((el) => el.id === appStore.activeMovie.data?.id)

  // if exists then display modal
  // if not then save to store
  if (hasSameMovie) {
    isSimilarMoviesModalVisible.value = true
  } else {
    isAiLoaderVisible.value = true

    // getting similar movies from gemini
    const similarMoviesArray = await sendMessageToGemini(
      'similar_movies',
      appStore.activeMovie.data?.title || '',
      appStore.activeMovie.data?.release_date || '',
    )

    // forming an array of imdb ids
    const imdbIds: string[] = similarMoviesArray.map(
      (el) => el.imdb_link.replace(/\/$/, '').split('/').pop() as string,
    )

    appStore.aiLoaderText = t('loader.popcorn')
    const similarMovies = await getSimilarMovies(imdbIds)

    appStore.$patch((state) => {
      state.activeMovieSimilar.data.push({
        id: state.activeMovie.data.id,
        data: similarMovies,
      })
    })

    isSimilarMoviesModalVisible.value = true

    setTimeout(() => {
      appStore.aiLoaderText = t('loader.enjoy')

      setTimeout(() => {
        isAiLoaderVisible.value = false
      }, 3500)
    }, 2500)
  }
}

const getSimilarMovies = async (imdbIds: string[]): Promise<TMDBMovieByExternalId[]> => {
  const similarMovies: TMDBMovieByExternalId[] = []

  for (const imdbId of imdbIds) {
    const foundMovie = await findVideoByImdbId(imdbId)
    const movieList = foundMovie.movie_results

    if (movieList.length) {
      similarMovies.push(movieList[0])
    }
  }

  return similarMovies
}

const getOST = () => {
  return
  sendMessageToGemini(
    'movie_ost',
    store.activeSlideData.title,
    store.activeSlideData.release_date,
  ).then((aiModelResponse) => {
    for (const track of aiModelResponse) {
      searchTrackByName(`${track.track_name}`).then((spotifyResponse) => {
        store.activeMovieOST.push({
          name: track.track_name,
          artist: track.artist,
          uri: spotifyResponse.tracks.items[0].uri,
        })
      })
    }
  })
}

watch(
  () => appStore.activeMovie.data?.genre_ids,
  () => {
    appStore.getActiveMovieGenres()
  },
)

onMounted(() => {
  appStore.getActiveMovieGenres()
})
</script>
