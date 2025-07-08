<template>
  <div class="control-bg-diagonal control-form-input relative p-4">
    <input type="file" class="absolute inset-0 cursor-pointer opacity-0" @change="handleImage($event)" />

    <img v-if="image || preview" :src="image || preview" alt="Image" class="mx-auto max-h-52 rounded-xl shadow" />

    <div v-else class="py-2 text-center">
      <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 512 512" class="mx-auto mb-3 size-10 text-slate-400">
        <path
          fill="currentColor"
          d="M64 48C37.5 48 16 69.5 16 96V356.7l89.4-89.4c12.5-12.5 32.8-12.5 45.3 0L224 340.7 361.4 203.3c12.5-12.5 32.8-12.5 45.3 0L496 292.7V96c0-26.5-21.5-48-48-48H64zM16 379.3V416c0 26.5 21.5 48 48 48h36.7l112-112-73.4-73.4c-6.2-6.2-16.4-6.2-22.6 0L16 379.3zM395.3 214.6c-6.2-6.2-16.4-6.2-22.6 0L123.3 464H448c26.5 0 48-21.5 48-48V315.3L395.3 214.6zM0 96C0 60.7 28.7 32 64 32H448c35.3 0 64 28.7 64 64V416c0 35.3-28.7 64-64 64H64c-35.3 0-64-28.7-64-64V96zm168 64a40 40 0 1 0 -80 0 40 40 0 1 0 80 0zm-96 0a56 56 0 1 1 112 0A56 56 0 1 1 72 160z"
        />
      </svg>

      <div>{{ $attrs['placeholder'] || 'Select Image' }}</div>
    </div>

    <ControlFormValidate :name="$attrs['name']" />
  </div>
</template>

<script setup>
const preview = defineModel('preview', { type: String });
const file = defineModel('file', { type: [File, String] });

const image = ref();

const handleImage = (event) => {
  const reader = new FileReader();

  reader.readAsDataURL(event.target.files[0]);

  reader.onload = (e) => {
    image.value = e.target.result;
    file.value = event.target.files[0];
  };
};
</script>
