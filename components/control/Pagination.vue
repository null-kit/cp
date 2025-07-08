<template>
  <div class="flex gap-3">
    <nav v-if="totalPages >= 2" class="control-btn-group w-fit">
      <button
        v-if="currentPage >= 2"
        type="button"
        class="btn size-10 p-2"
        title="Previous Page"
        @click.prevent="currentPage--"
      >
        <svg xmlns="http://www.w3.org/2000/svg" class="m-auto size-3" viewBox="0 0 32 32">
          <polyline points="20 28 8 16 20 4" fill="none" stroke="currentColor" stroke-width="3" />
        </svg>
      </button>

      <button
        v-for="page in pages"
        :key="page"
        type="button"
        class="btn hidden size-10 md:grid"
        :class="{
          'text-surface/50 pointer-events-none': page === '...',
          'text-accent bg-surface/3 pointer-events-none font-medium': page === currentPage
        }"
        @click.prevent="currentPage = Number(page)"
      >
        <span class="m-auto">{{ page }}</span>
      </button>

      <button
        v-if="totalPages > currentPage"
        type="button"
        class="btn size-10 p-2"
        title="Next Page"
        @click.prevent="currentPage++"
      >
        <svg xmlns="http://www.w3.org/2000/svg" class="m-auto size-3" viewBox="0 0 32 32">
          <polyline points="12 28 24 16 12 4" fill="none" stroke="currentColor" stroke-width="3" />
        </svg>
      </button>
    </nav>

    <FormSelect v-model="perPage" :options="[25, 50, 100, 500, 1000]" autoclose />
  </div>
</template>

<script setup lang="ts">
const props = defineProps<{ totalPages: number; scrollTo?: string }>();

const route = useRoute();
const routePage = Number(route.query.page);
const currentPage = ref(routePage || 1);

const perPage = ref(Number(route.query.perPage) || 25);

const pages = computed(() => {
  const show = 5;
  const start = Math.max(currentPage.value - Math.floor(show / 2), 1);
  const end = Math.min(start + show - 1, props.totalPages);
  const pages: (number | string)[] = Array.from({ length: end - start + 1 }, (_, i) => start + i);

  if (start > 1) {
    pages.unshift('...');
    if (start >= 2) pages.unshift(1);
  }

  if (end < props.totalPages) {
    if (end <= props.totalPages - 2) pages.push('...');
    pages.push(props.totalPages);
  }

  return pages;
});

if (routePage <= 1 || isNaN(routePage)) {
  navigateTo({ query: { ...route.query, page: undefined } });
  currentPage.value = 1;
}

watch(perPage, () => {
  navigateTo({
    query: {
      ...route.query,
      perPage: perPage.value === 25 ? undefined : perPage.value,
      page: undefined
    }
  });
});

watch(currentPage, () => {
  navigateTo({ query: { ...route.query, page: currentPage.value } });

  if (props.scrollTo) document.querySelector(props.scrollTo)?.scrollIntoView({ behavior: 'smooth' });

  if (currentPage.value <= 1) navigateTo({ query: { ...route.query, page: undefined } });
});
</script>
