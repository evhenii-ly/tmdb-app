<template>
  <Carousel v-bind="carouselConfig" @slide-start="handleSlideStart">
    <Slide v-for="slide in items" :key="slide">
      <div class="carousel__item">
        <img class="carousel__item-image"
             :src="`https://image.tmdb.org/t/p/w200/${slide.poster_path}`" alt="">
      </div>
    </Slide>

    <template #addons>
      <div class="container carousel__navigation">
        <Navigation>
          <template #prev>
            <IconArrowLeft />
          </template>
          <template #next>
            <IconArrowRight />
          </template>
        </Navigation>
      </div>
    </template>
  </Carousel>
</template>

<style lang="scss">
.carousel {
  display: flex;
  flex-direction: column-reverse;
  margin-top: auto;

  &__navigation {
    display: flex;
    gap: 16px;
    margin-bottom: 40px;
  }

  &__prev,
  &__next {
    position: static;
    margin: 0;
    transform: none;
  }

  &__viewport {
    margin-top: -42px;
  }

  &__track {
    align-items: flex-end;
    height: 296px;
  }

  &__slide {
    width: 176px;
    height: 264px;
    background: #000;
    transition: width 0.4s ease, height 0.4s ease;
    border-radius: 12px;
    overflow: hidden;

    &--active {
      width: 208px;
      height: 296px;

      .carousel__item {
        opacity: 1;
      }
    }
  }

  &__item {
    width: 100%;
    height: 100%;
    opacity: 0.5;
    transition: opacity 0.4s ease;
  }

  &__item-image {
    width: 100%;
    height: 100%;
    object-fit: cover;
  }
}
</style>

<script setup lang="ts">
import { onMounted } from 'vue'

const props = defineProps({
  items: {
    type: Object,
    required: true,
  },
});

import 'vue3-carousel/carousel.css'
import { Carousel, Slide, Navigation } from 'vue3-carousel'
import { store } from '@/stores/store'
import IconArrowLeft from '@/components/icons/IconArrowLeft.vue'
import IconArrowRight from '@/components/icons/IconArrowRight.vue'

const carouselConfig = {
  gap: 32,
  itemsToShow: 'auto',
  wrapAround: true,
}

const handleSlideStart = (data: any) => {
  store.activeSlideData = props.items[data.slidingToIndex];
}

onMounted(() => {
  store.activeSlideData = props.items[0];
})

</script>
