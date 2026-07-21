<template>
  <label class="relative inline-block whitespace-break-spaces">
    <span class="inline-flex items-center gap-3 text-sm">
      <span :class="['relative flex shrink-0', disabled ? 'cursor-not-allowed' : 'cursor-pointer']">
        <input
          v-model="model"
          :class="[
            'peer cursor-pointer appearance-none ring duration-200 checked:ring-green-600',
            'disabled:cursor-not-allowed disabled:bg-slate-50 disabled:ring-slate-100',
            isSwitch || type === 'radio' ? 'rounded-full' : 'rounded-md',
            isSwitch ? 'h-6 w-11 bg-slate-100 shadow checked:bg-green-500' : 'size-5 bg-blue-500 shadow',
            indeterminate ? 'ring-green-600' : 'ring-slate-200'
          ]"
          :type="type"
          :name="name"
          :value="value"
          :disabled="disabled"
          :checked="checked"
        />

        <span
          v-if="isSwitch"
          class="absolute inset-0.5 size-5 rounded-full bg-white shadow duration-200 peer-checked:translate-x-full"
          :class="{ 'peer-checked:bg-white': !disabled }"
        />

        <svg
          v-else
          xmlns="http://www.w3.org/2000/svg"
          viewBox="0 0 32 32"
          :class="['absolute inset-0 size-full p-1', disabled ? 'text-slate-200' : 'text-green-500']"
        >
          <circle
            v-if="type === 'radio'"
            fill="currentColor"
            cx="16"
            cy="16"
            r="12"
            :class="['duration-300', model === value ? 'opacity-100' : 'opacity-0']"
          />

          <path
            v-else
            fill="none"
            stroke-width="4"
            d="m5 18 7 7L28 9"
            class="duration-300"
            stroke="currentColor"
            stroke-dasharray="32"
            stroke-linecap="round"
            :style="`stroke-dashoffset:${isChecked ? 0 : 31}; opacity:${isChecked && !indeterminate ? 1 : 0}`"
          />

          <rect v-if="indeterminate" x="5" y="14" width="22" height="4" fill="currentColor" />
        </svg>
      </span>

      <slot>
        {{ label }}
      </slot>
    </span>

    <ControlFormValidate v-if="name" :name />

    <div v-if="help || $slots.help" class="field-help">
      <slot name="help">{{ help }}</slot>
    </div>
  </label>
</template>

<script setup lang="ts">
const model = defineModel<boolean | string | number | string[] | number[]>();

const {
  type = 'checkbox',
  checked,
  value
} = defineProps<{
  label?: string;
  type?: 'checkbox' | 'radio';
  name: string;
  value?: string | number;
  isSwitch?: boolean;
  indeterminate?: boolean;
  disabled?: boolean;
  checked?: boolean;
  help?: string;
}>();

const isChecked = computed(() => {
  if (Array.isArray(model.value) && value) {
    return model.value.map(String).includes(String(value));
  }

  return model.value;
});
</script>
