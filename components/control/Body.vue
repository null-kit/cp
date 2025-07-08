<template>
  <section class="rounded-2xl bg-white shadow ring ring-slate-200">
    <Title :key="$route.fullPath">{{ title || $route.meta.title }}</Title>

    <header
      v-if="title || $route.meta.title"
      class="z-1 flex items-center gap-4 rounded-t-2xl border-b border-slate-200 bg-white px-4 py-3"
    >
      <button class="control-btn control-btn-default size-10 p-2" @click="$router.back()" title="Back">
        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 320 512" class="size-4">
          <path
            fill="currentColor"
            d="M15 239c-9.4 9.4-9.4 24.6 0 33.9L207 465c9.4 9.4 24.6 9.4 33.9 0s9.4-24.6 0-33.9L65.9 256 241 81c9.4-9.4 9.4-24.6 0-33.9s-24.6-9.4-33.9 0L15 239z"
          />
        </svg>
      </button>

      <h2 class="mr-auto max-w-full truncate text-lg font-medium md:text-xl">
        {{ title && Object.keys($route.params).length > 0 ? 'Edit: ' : '' }}
        {{ title || $route.meta.title }}
      </h2>

      <NuxtLink v-if="actionName || actionLink" :to="actionLink" class="control-btn control-btn-main">
        {{ actionName || 'New Record' }}
      </NuxtLink>
    </header>

    <div class="space-y-5 p-4">
      <slot />

      <div v-if="$slots.cards" class="grid grid-cols-1 gap-5 md:grid-cols-2 lg:grid-cols-3">
        <slot name="cards" />
      </div>
    </div>

    <footer
      v-if="$slots.footer || submit"
      class="sticky bottom-0 flex items-center gap-6 rounded-b-2xl border-t border-slate-200 bg-linear-0 to-white p-3 backdrop-blur-sm"
    >
      <slot name="footer">
        <button type="submit" form="form" class="control-btn control-btn-main mx-auto w-full max-w-44">
          {{ submit || 'Submit' }}
        </button>
      </slot>
    </footer>
  </section>
</template>

<script setup lang="ts">
defineProps<{
  title?: string;
  submit?: string;
  actionName?: string;
  actionLink?: string;
}>();
</script>
