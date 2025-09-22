<template>
  <div class="block space-y-2 text-left">
    <label v-if="label" :for="id" class="control-form-label">
      {{ label }}
      <span v-if="required" title="Required field" class="control-form-required">*</span>
    </label>

    <div class="flex">
      <div v-if="slots.left" class="field-slot shrink-0 overflow-clip rounded-r-none">
        <slot name="left" />
      </div>

      <div class="relative w-full">
        <template v-if="type === 'select'">
          <select :id v-model="model" :class="[inputStyle, 'pr-7', 'cursor-pointer']" :name :disabled>
            <option selected disabled value>{{ placeholder }}</option>

            <slot />
          </select>

          <svg
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 32 32"
            class="text-surface/30 pointer-events-none absolute top-0 right-2 size-4 h-full"
          >
            <path fill="none" stroke="currentColor" stroke-width="3" d="m10 22 6 6 6-6m-12-12 6-6 6 6" />
          </svg>
        </template>

        <textarea
          v-else-if="type === 'textarea'"
          :id
          v-model="model"
          class="flex"
          :class="inputStyle"
          rows="3"
          :name
          :placeholder
          :disabled
          :pattern
        />

        <input
          v-else
          :id
          v-model="model"
          :class="inputStyle"
          :name
          :type="type === 'number' ? 'text' : type"
          :placeholder
          :disabled
          :accept
          :pattern
          :step
          @input="onInput"
        />

        <ControlFormValidate v-if="name" :name />
      </div>

      <div v-if="slots.right" class="field-slot shrink-0 overflow-clip rounded-l-none">
        <slot name="right" />
      </div>
    </div>

    <div v-if="help || $slots.help" class="field-help">
      <slot name="help">{{ help }} </slot>
    </div>
  </div>
</template>

<script setup lang="ts">
const model = defineModel<string | number | null>();

const id = useId();
const slots = useSlots();

const {
  type = 'text',
  name,
  inputClass
} = defineProps<{
  label?: string;
  type?: 'text' | 'password' | 'email' | 'number' | 'textarea' | 'select' | 'file' | 'url';
  name?: string;
  placeholder?: string;
  inputClass?: string;
  help?: string;
  disabled?: boolean;
  required?: boolean;
  accept?: string;
  pattern?: string;
  step?: string;
}>();

const onInput = (event: Event) => {
  if (type === 'number') {
    const input = event.target as HTMLInputElement;
    const value = input.value.replace(/[^\d.]/g, '');

    model.value = value || undefined;
    input.value = value;
  }
};

const inputStyle = ['control-form-input', slots.left && 'rounded-l-none', slots.right && 'rounded-r-none', inputClass];
</script>
