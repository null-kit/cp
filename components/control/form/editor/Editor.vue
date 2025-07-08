<template>
  <div>
    <div v-if="label" class="control-form-label mb-2">
      {{ label }}
      <span v-if="required" title="Required field" class="control-form-required">*</span>
    </div>

    <div
      class="relative rounded-lg bg-white shadow ring ring-slate-200 transition hover:ring-blue-200 has-focus:ring-blue-500"
    >
      <LazyControlFormEditorToolbar v-if="editor" :editor />

      <ClientOnly>
        <EditorContent :editor />
      </ClientOnly>

      <BubbleMenu v-if="editor" :editor>
        <div class="divide-y divide-slate-200 rounded-lg bg-white shadow-lg ring ring-slate-200">
          <LazyControlFormEditorLink v-if="editor.isActive('link')" :editor />
          <LazyControlFormEditorImage v-if="editor.isActive('image')" :editor />
          <LazyControlFormEditorYoutube v-if="editor.isActive('youtube')" :editor />
          <LazyControlFormEditorTable v-if="editor.isActive('table')" :editor />
        </div>
      </BubbleMenu>

      <FloatingMenu v-if="editor" :editor>
        <LazyControlFormEditorFloating :editor />
      </FloatingMenu>

      <ControlFormValidate :name />
    </div>
  </div>
</template>

<script setup lang="ts">
import { EditorContent, useEditor, BubbleMenu, FloatingMenu } from '@tiptap/vue-3';
import Document from '@tiptap/extension-document';
import Paragraph from '@tiptap/extension-paragraph';
import Text from '@tiptap/extension-text';
import Heading from '@tiptap/extension-heading';
import Bold from '@tiptap/extension-bold';
import TextAlign from '@tiptap/extension-text-align';
import Blockquote from '@tiptap/extension-blockquote';
import Italic from '@tiptap/extension-italic';
import Underline from '@tiptap/extension-underline';
import Link from '@tiptap/extension-link';
import Image from '@tiptap/extension-image';
import Youtube from '@tiptap/extension-youtube';

// 2.14
import Placeholder from '@tiptap/extension-placeholder';
import Gapcursor from '@tiptap/extension-gapcursor';
import OrderedList from '@tiptap/extension-ordered-list';
import BulletList from '@tiptap/extension-bullet-list';
import ListItem from '@tiptap/extension-list-item';
import Table from '@tiptap/extension-table';
import TableCell from '@tiptap/extension-table-cell';
import TableRow from '@tiptap/extension-table-row';
import TableHeader from '@tiptap/extension-table-header';

import { FaqExtension } from './extensions/FaqExtension';
import { AccentBlockExtension } from './extensions/AccentBlockExtension';

// TODO: 3.0.0
// import { BubbleMenu, FloatingMenu } from '@tiptap/vue-3/menus';
// import { OrderedList, BulletList, ListItem } from '@tiptap/extension-list';
// import { TableKit } from '@tiptap/extension-table';
// import { Gapcursor, Placeholder } from '@tiptap/extensions';

defineProps<{
  label?: string;
  name: string;
  placeholder?: string;
  required?: boolean;
}>();

const model = defineModel<string>();

const editor = useEditor({
  content: model.value,
  extensions: [
    Document,
    Paragraph,
    Text,
    Bold,
    Italic,
    Underline,
    BulletList,
    OrderedList,
    ListItem,
    Blockquote,
    Gapcursor,
    Table.extend({
      renderHTML({ HTMLAttributes }) {
        return ['div', { class: 'w-full overflow-auto' }, ['table', HTMLAttributes, ['tbody', 0]]];
      }
    }).configure({ resizable: true }), // 2.14
    TableCell, // 2.14
    TableRow, // 2.14
    TableHeader, // 2.14
    Link.configure({
      openOnClick: false,
      HTMLAttributes: { rel: null }
    }),
    Heading.configure({ levels: [2, 3, 4] }),
    Placeholder.configure({ placeholder: 'Enter Body' }),
    TextAlign.configure({ types: ['heading', 'paragraph'] }),
    Youtube.configure({ nocookie: true, modestBranding: true }),
    // TableKit.configure({ table: { resizable: true } }), // TODO: 3.0.0
    Image.extend({
      addAttributes() {
        return {
          ...this.parent?.(),
          class: { default: 'mr-auto' }
        };
      }
    }).configure({ inline: true }),
    FaqExtension,
    AccentBlockExtension
  ],
  editorProps: {
    attributes: {
      class: 'outline-none min-h-10 p-4 article max-w-3xl mx-auto'
    }
  },
  onUpdate: ({ editor }) => {
    model.value = editor.getHTML();
  }
});

onBeforeUnmount(() => unref(editor)?.destroy());
</script>

<style lang="postcss">
.tiptap {
  :first-child {
    margin-top: 0;
  }

  p.is-editor-empty:first-child::before {
    color: var(--color-surface);
    opacity: 0.3;
    content: attr(data-placeholder);
    float: left;
    height: 0;
    pointer-events: none;
  }

  .ProseMirror-selectednode {
    outline: 3px solid var(--color-accent);
    border-radius: var(--radius-lg);
    transition: outline 0.2s ease-out;
  }

  .ProseMirror-gapcursor:after {
    border-color: var(--color-surface);
  }

  [data-youtube-video] {
    cursor: move;

    iframe {
      pointer-events: none;
    }
  }

  table {
    th,
    td {
      position: relative;
    }

    .selectedCell:after {
      background: var(--color-edison);
      content: '';
      left: 0;
      right: 0;
      top: 0;
      bottom: 0;
      pointer-events: none;
      position: absolute;
      opacity: 0.3;
    }

    .column-resize-handle {
      background-color: var(--color-accent);
      bottom: 0;
      pointer-events: none;
      position: absolute;
      right: -1px;
      top: 0;
      width: 1px;
    }
  }

  &.resize-cursor {
    cursor: ew-resize;
    cursor: col-resize;
  }
}
</style>
