<template>
  <div class="flex items-center gap-1.5 p-1">
    <input
      v-model="link"
      type="url"
      class="min-h-7 appearance-none px-2 text-sm outline-none"
      placeholder="Enter link"
    />

    <button
      v-if="link"
      type="button"
      class="control-btn control-btn-default control-btn-sm text-xs leading-none"
      :class="{ 'text-blue-600 !ring-blue-500': noFollow }"
      @click="toggleNoFollow"
    >
      Nofollow
    </button>

    <button
      v-if="link && editor.isActive('link') && link === editor.getAttributes('link').href"
      type="button"
      class="control-btn control-btn-default control-btn-sm"
      @click="editor.chain().focus().unsetLink().run()"
    >
      <ControlIcon name="unlink" />
    </button>

    <button v-else type="button" class="control-btn control-btn-default control-btn-sm" @click="onSubmit">
      <ControlIcon name="check" />
    </button>
  </div>
</template>

<script setup lang="ts">
import type { Editor } from '@tiptap/vue-3';

const { editor } = defineProps<{ editor: Editor }>();

const link = ref('');

const noFollow = ref(false);

const onSubmit = () => {
  if (!link.value) return editor.chain().focus().extendMarkRange('link').unsetLink().run();

  editor
    .chain()
    .focus()
    .extendMarkRange('link')
    .setLink({ href: link.value, rel: noFollow.value ? 'noopener noreferrer nofollow' : null })
    .run();
};

const toggleNoFollow = () => {
  noFollow.value = !noFollow.value;
  onSubmit();
};

watchEffect(() => {
  if (editor) {
    link.value = editor.getAttributes('link').href || '';
    noFollow.value = editor.getAttributes('link').rel === 'noopener noreferrer nofollow';
  }
});
</script>
