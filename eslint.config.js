import withNuxt from './.playground/.nuxt/eslint.config.mjs';

export default withNuxt({
  rules: {
    'vue/html-self-closing': 'off',
    'vue/no-v-html': 'off',
    'no-undef': 'off'
  }
});
