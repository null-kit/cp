<template>
  <div class="control-bg-diagonal control-form-input relative p-4">
    <input type="file" class="absolute inset-0 cursor-pointer opacity-0" multiple @change="handleImages($event)" />

    <div class="flex flex-wrap justify-center gap-4">
      <div v-for="(img, index) in images" :key="index" class="relative">
        <img :src="img" alt="Image" class="max-h-32 rounded-xl shadow" />

        <button
          type="button"
          class="absolute top-2 right-2 grid size-6 rounded-full bg-red-500 text-white"
          @click.prevent="removeImage(img)"
        >
          <svg xmlns="http://www.w3.org/2000/svg" class="m-auto size-3" viewBox="0 0 24 24" fill="currentColor">
            <path
              d="M17 6H22V8H20V21C20 21.5523 19.5523 22 19 22H5C4.44772 22 4 21.5523 4 21V8H2V6H7V3C7 2.44772 7.44772 2 8 2H16C16.5523 2 17 2.44772 17 3V6ZM18 8H6V20H18V8ZM9 11H11V17H9V11ZM13 11H15V17H13V11ZM9 4V6H15V4H9Z"
            />
          </svg>
        </button>
      </div>

      <div class="grid size-32 rounded-xl bg-white py-3 text-center shadow ring ring-slate-200">
        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 512 512" class="m-auto mb-2 size-10 text-slate-400">
          <path
            fill="currentColor"
            d="M64 48C37.5 48 16 69.5 16 96V356.7l89.4-89.4c12.5-12.5 32.8-12.5 45.3 0L224 340.7 361.4 203.3c12.5-12.5 32.8-12.5 45.3 0L496 292.7V96c0-26.5-21.5-48-48-48H64zM16 379.3V416c0 26.5 21.5 48 48 48h36.7l112-112-73.4-73.4c-6.2-6.2-16.4-6.2-22.6 0L16 379.3zM395.3 214.6c-6.2-6.2-16.4-6.2-22.6 0L123.3 464H448c26.5 0 48-21.5 48-48V315.3L395.3 214.6zM0 96C0 60.7 28.7 32 64 32H448c35.3 0 64 28.7 64 64V416c0 35.3-28.7 64-64 64H64c-35.3 0-64-28.7-64-64V96zm168 64a40 40 0 1 0 -80 0 40 40 0 1 0 80 0zm-96 0a56 56 0 1 1 112 0A56 56 0 1 1 72 160z"
          />
        </svg>

        <div>{{ $attrs['placeholder'] || 'Add Images' }}</div>
      </div>
    </div>

    <ControlFormValidate :name="$attrs['name']" />
  </div>
</template>

<script setup>
const previews = defineModel('previews', { type: [String, Array], default: '' });
const files = defineModel('files', { type: Array, default: () => [] });
const removeFile = defineModel('delete', { type: Array, default: () => [] });

const images = ref(previews.value.length > 0 ? previews.value.split(', ') : []);

const handleImages = (event) => {
  const selectedFiles = event.target.files;

  Array.from(selectedFiles).forEach((file) => {
    const reader = new FileReader();

    reader.readAsDataURL(file);

    reader.onload = (e) => {
      images.value.push(e.target.result);
      files.value.push(file);
    };
  });
};

const removeImage = (img) => {
  images.value = images.value.filter((image) => image !== img);
  previews.value = images.value.join(', ');

  removeFile.value.push(img);
};
</script>
