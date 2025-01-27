<template>
  <div v-if="store.activeSlideData" class="container movie-info">
    <h1 class="movie-info__title">{{ store.activeSlideData.title }}</h1>
    <div class="movie-info__content">
      <div class="movie-info__details">
        <div class="movie-info__imdb">
          <IconImdb />

          <span class="movie-info__imdb-average">{{ voteAverageRounded() }}&nbsp;</span>
          <span class="movie-info__imdb-count">({{ store.activeSlideData.vote_count }})</span>
        </div>
        <div class="movie-info__year movie-info__item">{{ releaseYear }}</div>
        <div class="movie-info__genres">
          <template v-if="filledGenreList">
            <span v-for="(genre, index) in filledGenreList" :key="genre">
              {{ genre.name }}<template v-if="index < filledGenreList.length - 1">,&nbsp;</template>
            </span>
          </template>
        </div>
      </div>
      <p class="movie-info__description">
        {{ overviewShort }}
        <RouterLink
          :to="`/movie/${store.activeSlideData.id}`"
          v-bind="{ 'data-text': 'See more' }"
          >See more
        </RouterLink>
      </p>

      <div class="movie-info__buttons">
        <Button variant="outlined" severity="secondary" @click="isMovieVideosModalVisible = true">
          Watch trailer
        </Button>
        <Button @click="getOST">
          Watch now
        </Button>

        <Button
          variant="outlined"
          severity="secondary"
          class="movie-info__similar"
          @click="findMovieLinks"
        >
          <IconMagicWand />
          Similar with AI
        </Button>
      </div>
    </div>
  </div>
  <Skeleton v-else width="470px" height="4rem" borderRadius="16px"></Skeleton>

  <SpotifyPlayer />

  <MovieVideos v-model:visible="isMovieVideosModalVisible" />
  <SimilarMovies v-model:visible="isSimilarMoviesModalVisible" />
  <AiLoader :visible="isAiLoaderVisible" :text="aiLoaderText" :closing="isAiLoaderClosing" />
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
import { store } from '@/stores/store'
import IconImdb from '@/components/icons/IconImdb.vue'
import IconMagicWand from '@/components/icons/IconMagicWand.vue'
import { useMovies } from '@/composables/useMovies'
import { useGemini } from '@/composables/useGemini'
import { useSpotify } from '@/composables/useSpotify'
import MovieVideos from '@/components/MovieVideos.vue'
import SimilarMovies from '@/components/SimilarMovies.vue'
import AiLoader from '@/components/AiLoader.vue'
import SpotifyPlayer from '@/components/SpotifyPlayer.vue'
import type { TMDBMovieByExternalId } from '@/types'

const { fetchGenres, findVideoByImdbId } = useMovies()
const { sendMessageToGemini } = useGemini()
const { searchTrackByName } = useSpotify()

const getReleaseYearFromDate = (): number|NA =>
  store.activeSlideData.release_date
    ? new Date(store.activeSlideData.release_date).getFullYear()
    : 'N/A'

const getOverviewShort = (): string => {
  return store.activeSlideData.overview.length > 170
    ? store.activeSlideData.overview.slice(0, 170).trim() + '...'
    : store.activeSlideData.overview
}

const voteAverageRounded = () => Number(store.activeSlideData.vote_average).toFixed(1)

const filledGenreList = ref<Genre[]>([])
const overviewShort = ref('')
const releaseYear = ref<number|NA>('N/A')
const isMovieVideosModalVisible = ref(false)
const isSimilarMoviesModalVisible = ref(false)
const isAiLoaderVisible = ref(false)
const isAiLoaderClosing = ref(false)
const aiLoaderText = ref('')

const fillGenreList = async () => {
  await fetchGenres()

  watch(
    () => store.activeSlideData,
    (newValue) => {
      const genreIdsArray = Object.values(newValue.genre_ids)

      filledGenreList.value = store.genres.genres.filter((value) => genreIdsArray.includes(value.id))
    },
    { immediate: true },
  )
}

const findMovieLinks = () => {
  console.log('getting...')

  isAiLoaderVisible.value = true
  aiLoaderText.value = 'Looking for the best matches...'

  sendMessageToGemini('similar_movies', store.activeSlideData.title, store.activeSlideData.release_date).then((aiModelResponse) => {
    const imdbIds: string[] = aiModelResponse.map((el) => el.imdb_link.replace(/\/$/, '').split('/').pop() as string)

    const getSimilarMovies = async () => {
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

    aiLoaderText.value = 'Making popcorn'

    setTimeout(() => {
      getSimilarMovies().then((res) => {
        console.log(res, 'res')

        store.similarMovies = res
        isSimilarMoviesModalVisible.value = true
        aiLoaderText.value = 'Enjoy!'

        setTimeout(() => {
          isAiLoaderClosing.value = true

          setTimeout(() => {
            isAiLoaderVisible.value = false
            isAiLoaderClosing.value = false
          }, 1000)
        }, 2000)
      })
    }, 2000)
  })
}

const getOST = () => {
  sendMessageToGemini('movie_ost', store.activeSlideData.title, store.activeSlideData.release_date).then((aiModelResponse) => {
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
  () => store.activeSlideData,
  () => {
    overviewShort.value = getOverviewShort()
    releaseYear.value = getReleaseYearFromDate()
  },
)

onMounted(() => {
  fillGenreList()
})
</script>
