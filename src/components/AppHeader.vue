<template>
  <div class="app-header">
    <div class="container">
      <MegaMenu :model="menuItems">
        <template #start>
          <RouterLink to="/" class="app-header__logo">
            <IconLogo />
          </RouterLink>
        </template>
        <template #item="{ item }">
          <router-link v-if="item.route" v-slot="{ href, navigate }" :to="item.route" custom>
            <a :href="href" @click="navigate">
              <span :class="item.icon" />
              <span class="ml-2">{{ item.label }}</span>
            </a>
          </router-link>
          <a v-else-if="!item.image" class="flex items-center p-4 cursor-pointer mb-2 gap-3">
            <span
              class="inline-flex items-center justify-center rounded-full bg-primary text-primary-contrast w-12 h-12"
            >
              <i :class="[item.icon, 'text-lg']"></i>
            </span>
            <span class="inline-flex flex-col gap-1">
              <span class="font-bold text-lg">{{ item.label }}</span>
              <span class="whitespace-nowrap">{{ item.subtext }}</span>
            </span>
          </a>
          <div v-else class="flex flex-col items-start gap-4 p-2">
            <img alt="" :src="item.image" class="w-full" />
            <span>{{ item.subtext }}</span>
            <Button outlined>{{ item.label }}</Button>
          </div>
        </template>
        <template #end>
          <Avatar
            image="https://primefaces.org/cdn/primevue/images/avatar/amyelsner.png"
            shape="circle"
          />

          <Button variant="text" @click="changeLanguage('en')">EN</Button>
          <Button variant="text" @click="changeLanguage('ua')">UA</Button>
        </template>
      </MegaMenu>
    </div>
  </div>
</template>

<style lang="scss">
.app-header {
  position: absolute;
  top: 0;
  left: 0;
  z-index: 1;
  width: 100%;

  &__logo {
    display: flex;
  }
}

.app-header .p-megamenu {
  background: none;
  border: none;
}
</style>

<script setup lang="ts">
import { MegaMenu, Button, Avatar } from 'primevue'
import { computed } from 'vue'
import IconLogo from '@/components/icons/IconLogo.vue'
import type { MenuItem } from 'primevue/menuitem'
import { useI18n } from 'vue-i18n'

const { locale, t } = useI18n({ useScope: 'global' })
const menuItems = computed<MenuItem[]>(() => [
  {
    label: t('header.nav.popular'),
    root: true,
  },
  {
    label: t('header.nav.new'),
    root: true,
  },
  {
    label: t('header.nav.genre'),
    root: true,
    items: [
      [
        {
          items: [
            { label: 'Features', icon: 'pi pi-list', subtext: 'Subtext of item' },
            { label: 'Customers', icon: 'pi pi-users', subtext: 'Subtext of item' },
            { label: 'Case Studies', icon: 'pi pi-file', subtext: 'Subtext of item' },
          ],
        },
      ],
      [
        {
          items: [
            { label: 'Solutions', icon: 'pi pi-shield', subtext: 'Subtext of item' },
            { label: 'Faq', icon: 'pi pi-question', subtext: 'Subtext of item' },
            { label: 'Library', icon: 'pi pi-search', subtext: 'Subtext of item' },
          ],
        },
      ],
      [
        {
          items: [
            { label: 'Community', icon: 'pi pi-comments', subtext: 'Subtext of item' },
            { label: 'Rewards', icon: 'pi pi-star', subtext: 'Subtext of item' },
            { label: 'Investors', icon: 'pi pi-globe', subtext: 'Subtext of item' },
          ],
        },
      ],
      [
        {
          items: [
            {
              image: 'https://primefaces.org/cdn/primevue/images/uikit/uikit-system.png',
              label: 'GET STARTED',
              subtext: 'Build spectacular apps in no time.',
            },
          ],
        },
      ],
    ],
  },
  {
    label: t('header.nav.movie'),
    root: true,
    route: 'movies',
  },
  {
    label: t('header.nav.series'),
    root: true,
  },
])

const changeLanguage = (lang: string) => {
  locale.value = lang
}
</script>
