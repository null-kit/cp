<template>
  <div class="sticky top-0 z-1 flex justify-center gap-3 rounded-t-lg border-b border-slate-200 bg-white p-2">
    <div class="control-btn-group rounded-md">
      <button
        v-for="level in [2, 3, 4] as Level[]"
        :key="level"
        type="button"
        class="control-btn control-btn-sm"
        :class="isActive('heading', { level })"
        :title="`Heading ${level}`"
        @click="runCommand((chain) => chain.toggleHeading({ level }))"
      >
        <ControlIcon :name="`h${level}`" />
      </button>
    </div>

    <div class="control-btn-group rounded-md">
      <button
        type="button"
        class="control-btn control-btn-sm"
        :class="isActive('bold')"
        title="Bold"
        @click="runCommand((chain) => chain.toggleBold())"
      >
        <ControlIcon name="bold" />
      </button>

      <button
        type="button"
        class="control-btn control-btn-sm"
        :class="isActive('italic')"
        title="Italic"
        @click="runCommand((chain) => chain.toggleItalic())"
      >
        <ControlIcon name="italic" />
      </button>

      <button
        type="button"
        class="control-btn control-btn-sm"
        :class="isActive('underline')"
        title="Underline"
        @click="runCommand((chain) => chain.toggleUnderline())"
      >
        <ControlIcon name="underline" />
      </button>

      <button
        type="button"
        class="control-btn control-btn-sm"
        title="Clear Format"
        @click="runCommand((chain) => chain.unsetAllMarks())"
      >
        <ControlIcon name="clear-format" />
      </button>
    </div>

    <ControlDropdown>
      <template #trigger>
        <button
          type="button"
          class="control-btn control-btn-default control-btn-sm"
          :class="isActive('link')"
          title="Add Link"
        >
          <ControlIcon name="link" />
        </button>
      </template>

      <LazyControlFormEditorLink :editor />
    </ControlDropdown>

    <div class="control-btn-group rounded-md">
      <button
        type="button"
        class="control-btn control-btn-sm"
        :class="isActive('bulletList')"
        title="Bullet List"
        @click="runCommand((chain) => chain.toggleBulletList())"
      >
        <ControlIcon name="ul" />
      </button>

      <button
        class="control-btn control-btn-sm"
        type="button"
        :class="isActive('orderedList')"
        title="Ordered List"
        @click="runCommand((chain) => chain.toggleOrderedList())"
      >
        <ControlIcon name="ol" />
      </button>
    </div>

    <div class="control-btn-group rounded-md">
      <button
        v-for="align in ['left', 'center', 'right']"
        :key="align"
        type="button"
        class="control-btn control-btn-sm"
        :class="isActive({ textAlign: align })"
        :title="`Align ${align}`"
        @click="runCommand((chain) => chain.setTextAlign(align))"
      >
        <ControlIcon :name="`align-${align}`" />
      </button>
    </div>

    <button
      type="button"
      class="control-btn control-btn-default control-btn-sm"
      :class="isActive('blockquote')"
      title="Blockquote"
      @click="runCommand((chain) => chain.toggleBlockquote())"
    >
      <ControlIcon name="quote" />
    </button>
  </div>
</template>

<script setup lang="ts">
import type { Editor } from '@tiptap/vue-3';
import type { Level } from '@tiptap/extension-heading';

const { editor } = defineProps<{ editor: Editor }>();

const runCommand = (command: (chain: ReturnType<Editor['chain']>) => ReturnType<Editor['chain']>) => {
  command(editor.chain().focus()).run();
};

const isActive = (type: string | object, attrs?: object) => {
  return editor.isActive(type as string, attrs) ? 'bg-slate-100 !fill-blue-500 hover:bg-slate-50' : '';
};
</script>
