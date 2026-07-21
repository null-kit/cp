<template>
  <ControlBody action-link="/control/users/create">
    <template v-if="records && records.length > 0" #cards>
      <ControlCard
        v-for="record in records"
        :key="record.id"
        :record
        :route-delete="'/api/users/' + record.id"
        :route-edit="'/control/users/' + record.id"
      />
    </template>

    <ControlEmpty v-if="!records || records.length === 0" />
  </ControlBody>
</template>

<script setup lang="ts">
definePageMeta({ layout: 'control', middleware: 'auth', title: 'Users' });

const records = await $fetch<User[]>('/api/users').catch(() => []);
</script>
