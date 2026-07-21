import { createResolver } from 'nuxt/kit';

const { resolve } = createResolver(import.meta.url);

export default defineNuxtConfig({
  alias: {
    '@null-kit/cp': resolve('./app/assets/css/source.css'),
    '@null-kit/cp/article': resolve('./app/assets/css/article.css'),
    '@null-kit/cp/utils': resolve('./shared/utils')
  },

  nitro: {
    storage: {
      fs: {
        driver: 'fs',
        base: './storage'
      }
    },
    imports: {
      dirs: ['server/validation']
    }
  },

  routeRules: {
    '/control/**': { ssr: false },
    '/storage/**': {
      proxy: '/api/storage/**',
      headers: { 'cache-control': 'public, immutable', expires: '1y' }
    }
  }
});
