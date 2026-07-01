import i18n from 'i18next'
import { initReactI18next } from 'react-i18next'

import locale from './locales/en.json'

type LocaleFile = typeof locale

const resources = {
  en: {
    translation: locale.translation,
    config: locale.config,
    loyaltyConfig: locale.loyaltyConfig,
  },
} as const

void i18n.use(initReactI18next).init({
  resources,
  lng: 'en',
  fallbackLng: 'en',
  defaultNS: 'translation',
  ns: ['translation', 'config', 'loyaltyConfig'],
  interpolation: {
    escapeValue: false,
  },
})

export function getWizardConfig() {
  return i18n.getResourceBundle('en', 'config') as LocaleFile['config']
}

export function getLoyaltyWizardConfig() {
  return i18n.getResourceBundle('en', 'loyaltyConfig') as LocaleFile['loyaltyConfig']
}

export default i18n
