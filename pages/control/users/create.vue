<template>
  <ControlBody submit="Create">
    <ControlMutateUser />
  </ControlBody>
</template>

<script setup lang="ts">
definePageMeta({ layout: 'control', middleware: 'auth', title: 'New User' });
</script>
