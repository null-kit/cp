import { fileURLToPath } from 'url';

export default defineNuxtConfig({
  nitro: {
    storage: {
      fs: {
        driver: 'fs',
        base: './storage'
      }
    }
  },
  routeRules: {
    '/storage/**': { proxy: `/api/storage/**` }
  },
  alias: {
    '@null-kit/cp': fileURLToPath(new URL('./assets/css/source.css', import.meta.url)),
    '@null-kit/cp/article': fileURLToPath(new URL('./assets/css/article.css', import.meta.url))
  }
});
