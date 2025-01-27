<template>
  <RouterLink :to="`/movie/${link}`">
    <Card style="max-width: 25rem; overflow: hidden">
      <template #header>
        <img :alt="title" :src="`https://image.tmdb.org/t/p/w200/${image}`" />
      </template>
      <template #title>
        {{ title }}
      </template>
      <template #content>
        <p class="m-0">
          {{ content }}
        </p>
      </template>
      <template #footer>
        <div class="flex gap-4 mt-1">
          <Button label="Cancel" severity="secondary" outlined class="w-full" />
          <Button label="Save" class="w-full" />
        </div>
      </template>
    </Card>
  </RouterLink>
</template>

<style lang="scss">
#content {

}
</style>

<script setup lang="ts">
import { Button, Card } from 'primevue'

defineProps<{
  title: {
    type: string,
    required: true,
  },
  content: {
    type: string,
    required: true,
  },
  image: {
    type: string,
    required: true,
  },
  link: {
    type: number,
    required: true,
  },
  date: {
    type: string,
    required: true,
  },
  rating: {
    type: number,
    required: true,
  },
}>()
</script>
