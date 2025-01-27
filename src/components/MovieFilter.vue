<template>
  <InputText type="text" v-model="value" @input="handleInput" />
</template>

<style lang="scss"></style>

<script setup lang="ts">
import { InputText } from 'primevue'
import { debounce } from '@/shared'
import { store } from '@/stores/store'
import { useMovies } from '@/composables/useMovies'
const { fetchMovies } = useMovies()
import { type Ref, ref } from 'vue'
import axios, { type AxiosRequestConfig, type AxiosResponse } from 'axios'

const value: Ref<string> = ref('')

const handleInput = () => {
  debouncedSearch();
}

const debouncedSearch = debounce(async () => {
  if (value.value.trim() !== '') {
    await searchByName(value.value)
  } else {
    await fetchMovies();
  }
}, 1000)

const searchByName = async (name: string) => {
  try {
    const options: AxiosRequestConfig = {
      method: 'GET',
      headers: {
        accept: 'application/json',
        Authorization:
          'Bearer eyJhbGciOiJIUzI1NiJ9.eyJhdWQiOiI0MjA3YzA0MDRiNjdmZWIxMGQxMmNiMzFkOWE3Zjk2MCIsIm5iZiI6MTczNzAzMDY5Ni4yODYsInN1YiI6IjY3ODhmYzI4NzljZjEzZWU0MWFkMjZmMiIsInNjb3BlcyI6WyJhcGlfcmVhZCJdLCJ2ZXJzaW9uIjoxfQ.89ZYdULE-DqIfQMrKz_8BpZPQhA0cXzvHKxHowWLcVY',
      },
    }

    const response: AxiosResponse = await axios.get(
      `https://api.themoviedb.org/3/search/movie?query=${name}&include_adult=false&language=en-US&page=1`,
      options,
    )

    store.movies = response.data
  } catch (error) {
    console.error('Failed to get access token:', error)
  }
}
</script>
