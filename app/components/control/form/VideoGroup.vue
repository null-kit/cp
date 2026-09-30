<template>
  <div class="control-bg-diagonal control-form-input relative p-4">
    <input
      type="file"
      accept="video/*"
      class="absolute inset-0 cursor-pointer opacity-0"
      multiple
      @change="handleVideos($event)"
    />

    <div class="flex flex-wrap justify-center gap-4">
      <div v-for="video in videos" :key="video.src" class="relative">
        <video :src="video.src" class="max-h-32 rounded-xl shadow" preload="metadata" muted />

        <button
          type="button"
          class="absolute top-2 right-2 grid size-6 rounded-full bg-red-500 text-white"
          @click.prevent="removeVideo(video)"
        >
          <svg xmlns="http://www.w3.org/2000/svg" class="m-auto size-3" viewBox="0 0 24 24" fill="currentColor">
            <path
              d="M17 6H22V8H20V21C20 21.5523 19.5523 22 19 22H5C4.44772 22 4 21.5523 4 21V8H2V6H7V3C7 2.44772 7.44772 2 8 2H16C16.5523 2 17 2.44772 17 3V6ZM18 8H6V20H18V8ZM9 11H11V17H9V11ZM13 11H15V17H13V11ZM9 4V6H15V4H9Z"
            />
          </svg>
        </button>
      </div>

      <div class="grid size-32 rounded-xl bg-white py-3 text-center shadow ring ring-slate-200">
        <svg
          aria-hidden="false"
          role="img"
          viewBox="0 0 24 24"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
          class="m-auto mb-2 size-10 text-slate-400"
        >
          <path
            d="M4.75 3.75H19.25M11.5 13.25H12.25M11.5 13.25V13M11.5 13.25V13.5M2.75 6.25H21.25V20.25H2.75V6.25ZM10.75 10.75V15.75L14 13.25L10.75 10.75Z"
            stroke="currentColor"
            stroke-width="1"
          />
        </svg>

        <div>{{ $attrs['placeholder'] || 'Add Videos' }}</div>
      </div>
    </div>

    <ControlFormValidate :name="$attrs['name']" />
  </div>
</template>

<script setup>
const previews = defineModel('previews', { type: [String, Array], default: '' });
const files = defineModel('files', { type: Array, default: () => [] });
const removeFile = defineModel('delete', { type: Array, default: () => [] });

const videos = ref(previews.value.length > 0 ? previews.value.split(', ').map((src) => ({ src })) : []);

const handleVideos = (event) => {
  Array.from(event.target.files).forEach((file) => {
    videos.value.push({ src: URL.createObjectURL(file), file });
    files.value.push(file);
  });

  event.target.value = '';
};

const removeVideo = (video) => {
  videos.value = videos.value.filter((item) => item !== video);

  if (video.file) {
    files.value = files.value.filter((file) => file !== video.file);

    URL.revokeObjectURL(video.src);
  } else {
    previews.value = videos.value
      .filter((item) => !item.file)
      .map((item) => item.src)
      .join(', ');

    removeFile.value.push(video.src);
  }
};

onUnmounted(() => videos.value.forEach((video) => video.file && URL.revokeObjectURL(video.src)));
</script>
