import { ref, watch } from 'vue'

const LOCALE_KEY = 'user_locale'
const SUPPORTED_LOCALES = ['en', 'ar']

const currentLocale = ref(localStorage.getItem(LOCALE_KEY) || 'en')

// Initialize document direction
const updateDocumentAttributes = (locale) => {
  document.documentElement.lang = locale
  document.documentElement.dir = locale === 'ar' ? 'rtl' : 'ltr'
}

// Run once on load
updateDocumentAttributes(currentLocale.value)

export function useLanguage() {
  const setLocale = (locale) => {
    if (!SUPPORTED_LOCALES.includes(locale)) return

    currentLocale.value = locale
    localStorage.setItem(LOCALE_KEY, locale)
    updateDocumentAttributes(locale)

    // Optional: Reload if heavy i18n changes are needed,
    // but for now we rely on reactivity where possible
    // window.location.reload()
  }

  return {
    currentLocale,
    setLocale,
    supportedLocales: SUPPORTED_LOCALES,
  }
}
