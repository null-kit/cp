<template>
  <div
    v-if="record"
    class="w-full rounded-xl p-px shadow shadow-black/5"
    :class="{ 'opacity-50 duration-200 hover:opacity-100': record.hidden || hidden }"
    data-radial
  >
    <div class="flex h-full flex-col rounded-[11px]">
      <div
        v-if="image || record.image"
        class="control-bg-diagonal flex rounded-t-[11px] border-b border-slate-200 bg-white p-3"
      >
        <img
          :src="image || record.image"
          class="h-20 max-w-60 rounded-lg object-contain"
          :alt="record.title || record.name || title"
        />
      </div>

      <div
        class="flex max-w-full items-center justify-between gap-4 border-b border-slate-200 bg-white p-3 font-medium"
        :class="{ 'rounded-t-[11px]': !record.image && !image }"
        :title="record.title || record.name || title"
      >
        <div class="truncate">
          {{ record.title || record.name || title }}
        </div>

        <NuxtLink
          v-if="routeOpen"
          :to="routeOpen"
          target="_blank"
          class="shrink-0 text-slate-400 duration-200 hover:text-blue-500"
        >
          <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 448 512" class="size-5">
            <path
              fill="currentColor"
              d="M384 64c17.7 0 32 14.3 32 32V416c0 17.7-14.3 32-32 32H64c-17.7 0-32-14.3-32-32V96c0-17.7 14.3-32 32-32H384zm64 32c0-35.3-28.7-64-64-64H64C28.7 32 0 60.7 0 96V416c0 35.3 28.7 64 64 64H384c35.3 0 64-28.7 64-64V96zM168 160c-8.8 0-16 7.2-16 16s7.2 16 16 16h97.4L132.7 324.7c-6.2 6.2-6.2 16.4 0 22.6s16.4 6.2 22.6 0L288 214.6V320c0 8.8 7.2 16 16 16s16-7.2 16-16V176c0-8.8-7.2-16-16-16H168z"
            />
          </svg>
        </NuxtLink>
      </div>

      <div class="control-details">
        <div v-if="record?.id">#{{ record.id }}</div>

        <div v-if="date">
          {{ formatDate(date) }}
        </div>

        <slot />

        <div
          v-if="record.featured || record.popular"
          class="flex items-center gap-1 bg-orange-50 text-orange-600 shadow ring-orange-500"
        >
          <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 448 512" class="size-3.5">
            <path
              fill="currentColor"
              d="M239.7 109.4c6.1 7.7 15.5 12.1 25.3 12s19.1-4.7 25.1-12.5c8.4-11 16.9-21.7 25.6-31.1c27.8 28.8 52.1 65.5 69.8 101.1c19.6 39.4 30.5 75.7 30.5 97.6C416 388.3 328.8 480 224 480C118 480 32 388.4 32 276.5c0-29.9 14.4-70.8 40.9-115.4c24.7-41.6 59.3-85.3 100.2-124.7c23.5 22.7 45.7 47 66.6 73zm25-20c-6.9-8.6-13.9-17-21-25.2C225.6 43.6 206.7 24 187 5.5c-7.8-7.3-19.9-7.3-27.7-.1c-46.5 43.2-86 92.3-113.9 139.3C17.8 191.2 0 238.1 0 276.5C0 404.1 98.4 512 224 512c124.2 0 224-107.8 224-235.5c0-29.3-13.5-71.1-33.8-111.9c-20.7-41.4-49.9-85-84.5-118c-7.8-7.5-20.1-7.5-28-.1c-5.7 5.4-11.2 11.3-16.5 17.4c-7.3 8.4-14.2 17.2-20.5 25.5zM128 306.8c0-23.7 13-46.3 47.1-89.1c16.8 21.3 46.2 58.7 62.6 79.6c12.5 15.9 36.3 16.3 49.4 1l23.4-27.2c17.8 38.8 9.4 86.6-24.9 110.7C267.1 394 247.7 400 225.7 400c-28.2 0-52.6-9-69.8-24.7c-17-15.5-28-38.4-28-68.5zm72-109.2c-12.7-16.1-37-16.2-49.8-.1C116.8 239.4 96 270.3 96 306.8c0 38.5 14.3 70.2 38.4 92.1c23.9 21.8 56.4 33.1 91.3 33.1c28.5 0 54.1-8 77.7-23.7l0 0 .3-.2c51.2-35.7 59.1-104.2 33.9-154.6c-10.7-21.4-37.3-19.7-49.9-5.1l-24.9 29 0 0c-16.5-21-46-58.5-62.8-79.8z"
            />
          </svg>

          Top
        </div>

        <div
          v-if="record.hidden || hidden"
          class="flex items-center gap-1 bg-blue-50 text-blue-600 shadow ring-blue-200"
        >
          <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 640 512" class="size-4">
            <path
              fill="currentColor"
              d="M38.8 5.1C28.4-3.1 13.3-1.2 5.1 9.2S-1.2 34.7 9.2 42.9l592 464c10.4 8.2 25.5 6.3 33.7-4.1s6.3-25.5-4.1-33.7L525.6 386.7c39.6-40.6 66.4-86.1 79.9-118.4c3.3-7.9 3.3-16.7 0-24.6c-14.9-35.7-46.2-87.7-93-131.1C465.5 68.8 400.8 32 320 32c-68.2 0-125 26.3-169.3 60.8L38.8 5.1zm151 118.3C226 97.7 269.5 80 320 80c65.2 0 118.8 29.6 159.9 67.7C518.4 183.5 545 226 558.6 256c-12.6 28-36.6 66.8-70.9 100.9l-53.8-42.2c9.1-17.6 14.2-37.5 14.2-58.7c0-70.7-57.3-128-128-128c-32.2 0-61.7 11.9-84.2 31.5l-46.1-36.1zM394.9 284.2l-81.5-63.9c4.2-8.5 6.6-18.2 6.6-28.3c0-5.5-.7-10.9-2-16c.7 0 1.3 0 2 0c44.2 0 80 35.8 80 80c0 9.9-1.8 19.4-5.1 28.2zm51.3 163.3l-41.9-33C378.8 425.4 350.7 432 320 432c-65.2 0-118.8-29.6-159.9-67.7C121.6 328.5 95 286 81.4 256c8.3-18.4 21.5-41.5 39.4-64.8L83.1 161.5C60.3 191.2 44 220.8 34.5 243.7c-3.3 7.9-3.3 16.7 0 24.6c14.9 35.7 46.2 87.7 93 131.1C174.5 443.2 239.2 480 320 480c47.8 0 89.9-12.9 126.2-32.5zm-88-69.3L302 334c-23.5-5.4-43.1-21.2-53.7-42.3l-56.1-44.2c-.2 2.8-.3 5.6-.3 8.5c0 70.7 57.3 128 128 128c13.3 0 26.1-2 38.2-5.8z"
            />
          </svg>

          Hidden
        </div>
      </div>

      <div
        v-if="$slots['actions'] || routeEdit || routeDelete"
        class="mt-px flex gap-px overflow-hidden rounded-b-[11px] text-center text-sm *:flex-1 *:bg-white/95 *:p-2 *:duration-200"
      >
        <slot name="actions">
          <NuxtLink :to="routeEdit" class="flex items-center justify-center gap-3">
            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 512 512" class="size-4">
              <path
                d="M441 58.9L453.1 71c9.4 9.4 9.4 24.6 0 33.9L424 134.1 377.9 88 407 58.9c9.4-9.4 24.6-9.4 33.9 0zM209.8 256.2L344 121.9 390.1 168 255.8 302.2c-2.9 2.9-6.5 5-10.4 6.1l-58.5 16.7 16.7-58.5c1.1-3.9 3.2-7.5 6.1-10.4zM373.1 25L175.8 222.2c-8.7 8.7-15 19.4-18.3 31.1l-28.6 100c-2.4 8.4-.1 17.4 6.1 23.6s15.2 8.5 23.6 6.1l100-28.6c11.8-3.4 22.5-9.7 31.1-18.3L487 138.9c28.1-28.1 28.1-73.7 0-101.8L474.9 25C446.8-3.1 401.2-3.1 373.1 25zM88 64C39.4 64 0 103.4 0 152V424c0 48.6 39.4 88 88 88H360c48.6 0 88-39.4 88-88V312c0-13.3-10.7-24-24-24s-24 10.7-24 24V424c0 22.1-17.9 40-40 40H88c-22.1 0-40-17.9-40-40V152c0-22.1 17.9-40 40-40H200c13.3 0 24-10.7 24-24s-10.7-24-24-24H88z"
              />
            </svg>

            Edit
          </NuxtLink>

          <button
            type="button"
            @click="removeRecord"
            class="flex items-center justify-center gap-3 hover:bg-red-50/95 hover:text-red-500"
          >
            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 448 512" class="size-4">
              <path
                fill="currentColor"
                d="M170.5 51.6L151.5 80h145l-19-28.4c-1.5-2.2-4-3.6-6.7-3.6H177.1c-2.7 0-5.2 1.3-6.7 3.6zm147-26.6L354.2 80h13.7H416h8c13.3 0 24 10.7 24 24s-10.7 24-24 24H412.4L388.4 452.7c-2.5 33.4-30.3 59.3-63.8 59.3H123.4c-33.5 0-61.3-25.9-63.8-59.3L35.6 128H24c-13.3 0-24-10.7-24-24S10.7 80 24 80h8H80.1 93.8l36.7-55.1C140.9 9.4 158.4 0 177.1 0h93.7c18.7 0 36.2 9.4 46.6 24.9zM83.7 128l23.8 321.2c.6 8.4 7.6 14.8 16 14.8H324.6c8.4 0 15.3-6.5 16-14.8L364.3 128H83.7zm62.2 81.9c7.8-7.8 20.5-7.8 28.3 0L224 259.7l49.9-49.9c7.8-7.8 20.5-7.8 28.3 0s7.8 20.5 0 28.3L252.3 288l49.9 49.9c7.8 7.8 7.8 20.5 0 28.3s-20.5 7.8-28.3 0L224 316.3l-49.9 49.9c-7.8 7.8-20.5 7.8-28.3 0s-7.8-20.5 0-28.3L195.7 288l-49.9-49.9c-7.8-7.8-7.8-20.5 0-28.3z"
              />
            </svg>

            Delete
          </button>
        </slot>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
const props = defineProps({
  record: {
    type: Object,
    default: undefined
  },
  hidden: Boolean,
  title: {
    type: String,
    default: 'No Title'
  },
  image: {
    type: String,
    default: undefined
  },
  routeOpen: {
    type: String,
    default: undefined
  },
  routeEdit: {
    type: String,
    default: undefined
  },
  routeDelete: {
    type: String,
    default: undefined
  }
});

const date = computed(() => props.record?.date || props.record?.createdAt || props.record?.created_at);

const removeRecord = async () => {
  if (confirm('Are you sure want to delete?')) {
    if (props.record?.image || props.image) {
      await $fetch(`/api/storage/${props.record?.image || props.image}`, { method: 'DELETE' });
    }

    $fetch(props.routeDelete, { method: 'DELETE' }).then(() => {
      useToast('success', 'Record has been deleted');
      refreshNuxtData();
    });
  }
};
</script>
