<template>
  <div class="flex items-center p-1">
    <input
      v-model="link"
      type="url"
      class="min-h-7 appearance-none px-2 text-sm outline-none"
      placeholder="Enter youtube link"
    />

    <button
      v-if="link && link !== editor.getAttributes('youtube').src"
      type="button"
      class="control-btn control-btn-default control-btn-sm"
      @click="onSubmit"
    >
      <ControlIcon name="check" />
    </button>

    <button
      v-if="editor.isActive('youtube')"
      type="button"
      class="control-btn control-btn-default control-btn-sm ml-1 text-red-500"
      @click="editor.commands.deleteSelection()"
    >
      <ControlIcon name="remove" />
    </button>
  </div>
</template>

<script setup lang="ts">
import type { Editor } from '@tiptap/vue-3';

const { editor } = defineProps<{ editor: Editor }>();

const link = ref<string | undefined>(editor.getAttributes('youtube').src);

const onSubmit = () => {
  if (!link.value) return;

  editor.chain().focus().setYoutubeVideo({ src: link.value }).run();
};

onUnmounted(() => {
  link.value = undefined;
});
</script>
