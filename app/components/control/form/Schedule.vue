<template>
  <ControlFormDate v-model="publishAt" :name :label :min="new Date()" time="hours" clearable />
</template>

<script setup lang="ts">
const { label = 'Schedule Publish', name = 'publishAt' } = defineProps<{
  label?: string;
  name?: string;
}>();

const publishAt = defineModel<Date | string | null | undefined>({ required: true });

const hidden = defineModel<boolean>('hidden');

watch(publishAt, (value) => {
  if (value) hidden.value = true;
});
</script>
