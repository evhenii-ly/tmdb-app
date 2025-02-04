import { createI18n } from 'vue-i18n'

// Импортируем переводы
import en from './en.json'
import ua from './ua.json'

// Создаём экземпляр i18n
const i18n = createI18n({
  legacy: false,
  locale: 'en',
  fallbackLocale: 'en',
  messages: { en, ua }
})

export default i18n
