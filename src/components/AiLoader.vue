<template>
  <div class="ai" ref="aiLoader">
    <span class="ai__text" ref="aiLoaderText">{{ animatedText }}</span>
    <IconAILoader ref="aiLoaderIcon" />
  </div>
</template>

<style lang="scss">
.ai {
  position: fixed;
  top: 0;
  left: 0;
  z-index: 9999;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  width: 100%;
  height: 100%;
  background-color: #000;
  opacity: 0;
  pointer-events: none;

  &__text {
    margin-bottom: 30px;
    color: #fff;
    font-size: 40px;
    opacity: 0;
    transform-origin: top center;
  }
}

.ai svg {
  position: relative;
  opacity: 0;
}

.ai svg g {
  transform-origin: center;
  transform-box: fill-box;
}

#ai-loader-a {
  animation: clockwise 8s linear infinite;
}

#ai-loader-b {
  animation: clockwise 10s linear infinite;
}

#ai-loader-d {
  animation: clockwise 12s linear infinite;
}

#ai-loader-f {
  animation: clockwise 9s linear infinite;
}

#ai-loader-c {
  animation: anticlockwise 9s linear infinite;
}

#ai-loader-e {
  animation: anticlockwise 11s linear infinite;
}

/* for 0 to 360deg rotation */
@keyframes clockwise {
  from {
    transform: rotatez(0deg);
  }

  to {
    transform: rotatez(360deg);
  }
}

/* for 0 to -360deg rotation */
@keyframes anticlockwise {
  from {
    transform: rotatez(0deg);
  }

  to {
    transform: rotatez(-360deg);
  }
}

/* for smart-phone */
@media only screen and (max-width: 600px) {
  svg {
    width: fit-content;
    margin: 10px;
  }
}

@keyframes fade-in-loader {
  0% {
    opacity: 0;
  }

  100% {
    opacity: 1;
  }
}

@keyframes fade-in-loader-text {
  0% {
    opacity: 0;
    transform: translateY(-10vh);
  }

  100% {
    opacity: 1;
    transform: translateY(0);
  }
}

@keyframes fade-out-loader {
  0% {
    opacity: 1;
  }

  100% {
    opacity: 0;
  }
}

@keyframes fade-out-loader-text {
  0% {
    opacity: 1;
    transform: translateY(0);
  }

  100% {
    opacity: 0;
    transform: translateY(-10vh);
  }
}
</style>

<script setup lang="ts">
import { computed, onMounted, ref, watch } from 'vue'
import IconAILoader from '@/components/icons/IconAILoader.vue'
import type { AiLoader } from '@/types'
import { gsap } from 'gsap'
import { TextPlugin } from 'gsap/TextPlugin'
import { useAppStore } from '@/stores/app.ts'
import { useI18n } from 'vue-i18n'

const props = defineProps<AiLoader>()

const { t } = useI18n()
const appStore = useAppStore()
const aiLoader = ref<HTMLElement | null>(null)
const aiLoaderIcon = ref<InstanceType<typeof IconAILoader> | null>(null)
const aiLoaderText = ref<HTMLElement | null>(null)
const animatedText = ref<string>(t('loader.looking'))

gsap.registerPlugin(TextPlugin)

const showAILoader = (): void => {
  const timeline = gsap.timeline()

  gsap.to(aiLoader.value, { opacity: 1 })
  gsap.fromTo(aiLoaderIcon.value?.$el, { opacity: 0 }, { opacity: 1, duration: 2, delay: 1 })
  timeline.fromTo(
    aiLoaderText.value,
    { scale: 1.4, translateY: -60, opacity: 0 },
    { scale: 1, translateY: 0, opacity: 1, duration: 1.5, delay: 2 },
  )
}

const updateAILoaderText = (text: string) => {
  const timeline = gsap.timeline()

  timeline
    .to(aiLoaderText.value, { text: { value: '', speed: 1, rtl: true }, delay: 0.5, duration: 1 })
    .to(aiLoaderText.value, { text: { value: text, speed: 1 }, delay: 0.5 })
}

const hideAILoader = (): void => {
  gsap.to(aiLoader.value, { opacity: 0 })
}

// watch(() => props.text, (newValue, oldValue) => {
// if (newValue !== oldValue) {
//     textClass.value = 'ai__text--hide'
//
//     setTimeout(() => {
//       animatedText.value = newValue
//       textClass.value = 'ai__text--show'
//     }, 1000)
//   }
// })
watch(
  () => props.visible,
  (newVisibleValue) => {
    // check if the new value is true then show the loader,
    // otherwise hide the loader
    if (newVisibleValue) {
      showAILoader()
    } else {
      hideAILoader()
    }
  },
)

watch(
  () => appStore.aiLoaderText,
  (newValue) => {
    console.log(newValue, 'newValue')
      updateAILoaderText(newValue)
  },
)
</script>
