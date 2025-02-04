<template>
  <InputText type="text" v-model="value" @input="handleInput" />
</template>

<style lang="scss"></style>

<script setup lang="ts">
import { InputText } from 'primevue'
import { debounce } from '@/shared'
import { store } from '@/stores/store'
import { useMovies } from '@/composables/api/useMovies'
const { fetchMovies } = useMovies()
import { type Ref, ref } from 'vue'
import axios, { type AxiosRequestConfig, type AxiosResponse } from 'axios'

const value: Ref<string> = ref('')

const handleInput = () => {
  debouncedSearch();
}

const debouncedSearch = debounce(async () => {
  if (value.value.trim() !== '') {
    // await searchByName(value.value)
  } else {
    await fetchMovies();
  }
}, 1000)
</script>
