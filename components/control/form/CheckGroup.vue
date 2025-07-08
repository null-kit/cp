<template>
  <label class="relative block">
    <span v-if="label" class="control-form-label mb-2">
      {{ label }}
      <span v-if="required" title="Required field" class="control-form-required">*</span>
    </span>

    <span v-if="options && options.length > 0" class="control-form-input flex flex-wrap items-center gap-2 p-2">
      <label v-for="(category, index) in options" :key="index" class="relative cursor-pointer">
        <input
          v-model="model"
          :type="type"
          :name="name"
          class="peer absolute inset-0 size-full appearance-none rounded-md shadow ring-1 ring-slate-200 duration-200 checked:bg-blue-50 checked:ring-blue-500 hover:bg-slate-50"
          :value="category[keyValue] || category"
        />

        <span class="relative block px-2.5 py-0.5 duration-200 peer-checked:text-blue-700">
          {{ category[keyName] || category }}
        </span>
      </label>
    </span>

    <div
      v-else-if="fallback"
      class="flex min-h-10 items-center gap-2 rounded-xl px-4 py-1.5 shadow ring-1 ring-slate-200"
    >
      {{ fallback.emptyText || 'No Records' }}
      <NuxtLink
        v-if="fallback.createRoute"
        :to="fallback.createRoute"
        class="text-blue-500 duration-200 hover:text-blue-700"
      >
        {{ fallback.createText || 'Create First Record' }}
      </NuxtLink>
    </div>

    <ControlFormValidate v-if="name" :name />
  </label>
</template>

<script setup lang="ts" generic="T extends Record<string, unknown>">
const model = defineModel<string | number | undefined>();

const {
  type = 'checkbox',
  keyValue = 'id',
  keyName = 'title'
} = defineProps<{
  label?: string;
  type?: 'checkbox' | 'radio';
  required?: boolean;
  name: string;
  options?: T[];
  disabled?: boolean;
  checked?: boolean;
  keyValue?: string;
  keyName?: string;
  fallback?: {
    emptyText?: string;
    createRoute?: string;
    createText?: string;
  };
}>();
</script>
