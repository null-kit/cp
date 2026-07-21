<template>
  <blockquote class="text-center max-w-3xl mx-auto py-4 md:py-14">
    <svg
      class="size-8 mx-auto text-slate-300 mb-4"
      aria-hidden="true"
      xmlns="http://www.w3.org/2000/svg"
      fill="currentColor"
      viewBox="0 0 18 14"
    >
      <path
        d="M6 0H2a2 2 0 0 0-2 2v4a2 2 0 0 0 2 2h4v1a3 3 0 0 1-3 3H2a1 1 0 0 0 0 2h1a5.006 5.006 0 0 0 5-5V2a2 2 0 0 0-2-2Zm10 0h-4a2 2 0 0 0-2 2v4a2 2 0 0 0 2 2h4v1a3 3 0 0 1-3 3h-1a1 1 0 0 0 0 2h1a5.006 5.006 0 0 0 5-5V2a2 2 0 0 0-2-2Z"
      />
    </svg>

    <Transition
      enter-from-class="opacity-0 scale-75 duration-500"
      enter-to-class="opacity-100 scale-100 duration-500"
      leave-to-class="opacity-0"
      mode="out-in"
    >
      <div v-if="status !== 'pending'">
        <div class="text-xl md:text-2xl min-h-8 delay-100 mb-4">
          {{ quote?.quote || 'Nothing to say' }}
        </div>

        <div class="text-slate-500 mx-auto delay-200">
          {{ quote?.author }}
        </div>
      </div>

      <p v-else class="text-2xl min-h-8">Thinking...</p>
    </Transition>
  </blockquote>
</template>

<script setup>
const { data: quote, status } = useLazyFetch('https://dummyjson.com/quotes/random');
</script>
