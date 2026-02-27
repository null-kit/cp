import { join } from 'node:path';
import { fileURLToPath } from 'node:url';

const rootDir = fileURLToPath(new URL('..', import.meta.url));

export default defineNuxtConfig({
  compatibilityDate: '2025-11-03',
  ssr: false,
  extends: ['..'],
  modules: ['@nuxt/eslint'],
  eslint: {
    config: {
      rootDir
    }
  },
  srcDir: join(rootDir, '.playground', 'app'),
  css: ['@/assets/css/app.css'],
  postcss: {
    plugins: {
      '@tailwindcss/postcss': {}
    }
  }
});
