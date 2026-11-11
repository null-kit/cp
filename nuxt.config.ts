import { createResolver } from 'nuxt/kit';

const { resolve } = createResolver(import.meta.url);

export default defineNuxtConfig({
  modules: [resolve('./modules/schedule')],

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
    '/**': {
      headers: {
        'strict-transport-security': 'max-age=31536000; includeSubDomains',
        'x-frame-options': 'SAMEORIGIN',
        'x-content-type-options': 'nosniff',
        'referrer-policy': 'strict-origin-when-cross-origin',
        'permissions-policy': 'camera=(), microphone=(), geolocation=()',
        'x-xss-protection': '0'
      }
    },
    '/control/**': { ssr: false, headers: { 'x-robots-tag': 'noindex, nofollow' } },
    '/storage/**': {
      proxy: '/api/storage/**',
      headers: { 'cache-control': 'public, immutable', expires: '1y' }
    }
  }
});
