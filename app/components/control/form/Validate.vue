<template>
  <Transition enter-from-class="translate-y-2 opacity-0" enter-to-class="translate-y-0 opacity-100 duration-200" appear>
    <div
      v-if="name && validate[name]"
      class="pointer-events-none absolute top-full left-3 -mt-2 rounded-md bg-red-500 px-2 py-0.5 text-xs font-medium text-white shadow"
    >
      {{ validate[name] }}
    </div>
  </Transition>
</template>

<script setup lang="ts">
const { validate } = useValidate();

defineProps<{ name: string }>();
</script>
