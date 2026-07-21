<template>
  <ControlBody v-if="data" :title="data.name" submit="Update">
    <ControlMutateUser v-model="data" />
  </ControlBody>
</template>

<script setup lang="ts">
definePageMeta({ layout: 'control', middleware: 'auth' });

const id = useRoute().params.id;

const data = await $fetch<User>(`/api/users/${id}`).catch(() => {
  navigateTo('/control/users/create');
});
</script>
