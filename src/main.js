import './assets/main.css'
import './assets/main.scss'

import { createApp } from 'vue'
import { createPinia } from 'pinia'
import piniaPluginPersistedstate from 'pinia-plugin-persistedstate'

import App from './App.vue'
import router from './router'
import PrimeVue from 'primevue/config';
import Aura from '@primevue/themes/aura';
import ToastService from 'primevue/toastservice';
import { definePreset } from '@primevue/themes'
import 'lazysizes'
import 'lazysizes/plugins/attrchange/ls.attrchange'
import i18n from '@/locales'

const app = createApp(App)

const CustomPreset = definePreset(Aura, {
  semantic: {
    primary: {
      400: '#F5C51C',
    },
  },
  components: {
    button: {
      colorScheme: {
        dark: {
          outlined: {
            secondary: {
              color: '#fff',
              borderColor: 'rgba(255 255 255 / 60%)',
              hover: {
                color: '#FF7849',
                borderColor: '#FF7849',
              },
            },
          },
        },
      },
    },
  },
});

const pinia = createPinia()
pinia.use(piniaPluginPersistedstate)

app.use(pinia)
app.use(router)
app.use(PrimeVue, {
  theme: {
    preset: CustomPreset,
  }
})
app.use(ToastService);
app.use(i18n)

app.mount('#app')
