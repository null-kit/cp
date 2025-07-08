<template>
  <div v-if="editor.isActive('image')" class="divide-y divide-slate-200">
    <input
      v-model="image.alt"
      type="text"
      class="w-full appearance-none px-3 py-1.5 text-sm outline-none"
      placeholder="Enter alt"
      @focusout="onSubmit()"
    />

    <div class="flex gap-2 p-2">
      <div class="control-btn-group">
        <button
          v-for="action in Object.keys(actions) as (keyof typeof actions)[]"
          :key="action"
          type="button"
          class="btn btn-sm"
          :class="{ 'bg-blue-50/50 text-blue-500': editor.getAttributes('image').class === actions[action] }"
          @click="onSubmit(action)"
        >
          <ControlIcon :name="action" />
        </button>
      </div>
    </div>

    <div class="flex items-center gap-2 p-2">
      <input
        v-model="image.size"
        type="range"
        min="20"
        max="100"
        class="h-2 w-full appearance-none rounded bg-slate-200"
        @change="onSubmit()"
      />

      <div v-if="image.size" class="w-8 text-center text-xs">{{ image.size }}%</div>
    </div>
  </div>
</template>

<script setup lang="ts">
import type { Editor } from '@tiptap/vue-3';
import type { SetImageOptions } from '@tiptap/extension-image';

const { editor } = defineProps<{ editor: Editor }>();

const image = reactive({
  size: '',
  alt: '',
  class: ''
});

const actions = {
  'align-left': 'mr-auto',
  'align-center': 'mx-auto',
  'align-right': 'ml-auto',
  'float-left': 'float-left mr-4',
  'float-right': 'float-right ml-4'
};

const onSubmit = (align?: keyof typeof actions) => {
  if (align) image.class = actions[align];

  editor.commands.setImage({
    src: editor.getAttributes('image').src,
    alt: image.alt,
    class: image.class,
    width: image.size ? image.size + '%' : undefined
  } as SetImageOptions);
};

watchEffect(() => {
  if (editor) {
    const imgAttr = editor.getAttributes('image');

    image.alt = imgAttr.alt;
    image.class = imgAttr.class;
    image.size = imgAttr.width ? imgAttr.width.replace('%', '') : undefined;
  }
});
</script>

<style scoped>
input[type='range']::-webkit-slider-thumb {
  cursor: grab;
  appearance: none;
  width: 1rem;
  height: 1rem;
  border-radius: 50%;
  background: var(--color-surface);
}

input[type='range']::-webkit-slider-thumb:active {
  cursor: grabbing;
}
</style>
