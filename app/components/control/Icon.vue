<template>
  <svg xmlns="http://www.w3.org/2000/svg" class="size-4" fill="currentColor" viewBox="0 0 24 24">
    <use :href="`/control-icons.svg#${name}`" fill="currentColor" />
  </svg>
</template>

<script setup lang="ts">
defineProps<{ name: string }>();
</script>
