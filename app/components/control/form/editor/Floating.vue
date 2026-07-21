<template>
  <div class="control-btn-group bg-white">
    <label type="button" class="control-btn control-btn-sm cursor-pointer" title="Upload Image">
      <ControlIcon name="image" />
      <input type="file" class="hidden" accept="image/*" @change="onImageUpload" />
    </label>

    <ControlDropdown>
      <template #trigger>
        <button type="button" class="control-btn control-btn-sm" title="Add Youtube Video">
          <ControlIcon name="video" />
        </button>
      </template>

      <LazyControlFormEditorYoutube :editor />
    </ControlDropdown>

    <button
      type="button"
      class="control-btn control-btn-sm"
      title="Add Table"
      @click="editor.commands.insertTable({ rows: 3, cols: 3, withHeaderRow: false })"
    >
      <ControlIcon name="table" />
    </button>

    <button
      type="button"
      class="control-btn control-btn-sm"
      title="Add FAQ"
      @click="editor.commands.setFaq({ question: '', answer: '' })"
    >
      <ControlIcon name="qa" />
    </button>

    <button
      type="button"
      class="control-btn control-btn-sm"
      title="Add Accent Block"
      @click="editor.commands.setAccentBlock()"
    >
      <ControlIcon name="accent-block" />
    </button>
  </div>
</template>

<script setup lang="ts">
import type { Editor } from '@tiptap/vue-3';

const { editor } = defineProps<{ editor: Editor }>();

const onImageUpload = async (event: Event) => {
  const target = event.target as HTMLInputElement;

  const file = target.files?.[0];

  if (file) {
    const body = new FormData();

    body.append('image', file);

    const response = await $fetch('/api/storage/editor', { method: 'POST', body });

    if (response[0]) editor.commands.setImage({ src: response[0].url });
  }
};
</script>
