import { Node, mergeAttributes } from '@tiptap/core';
import { VueNodeViewRenderer } from '@tiptap/vue-3';
import AccentBlockComponent from '@/components/control/form/editor/extensions/AccentBlockComponent.vue';

export interface Options {
  HTMLAttributes: Record<string, any>;
}

declare module '@tiptap/core' {
  interface Commands<ReturnType> {
    accentBlock: {
      setAccentBlock: () => ReturnType;
    };
  }
}

export const AccentBlockExtension = Node.create<Options>({
  name: 'accentBlock',
  group: 'block',
  content: '(paragraph | heading | bulletList | orderedList)+',
  selectable: true,

  parseHTML() {
    return [{ tag: 'div[class="accent-block"]' }];
  },

  renderHTML({ HTMLAttributes }) {
    return ['div', mergeAttributes({ class: 'accent-block' }, HTMLAttributes), 0];
  },

  addNodeView() {
    return VueNodeViewRenderer(AccentBlockComponent as any);
  },

  addCommands() {
    return {
      setAccentBlock:
        (attributes = {}) =>
        ({ chain }) => {
          return chain()
            .insertContent({
              type: this.name,
              attrs: attributes,
              content: [{ type: 'paragraph', content: [{ type: 'text', text: ' ' }] }]
            })
            .focus()
            .run();
        }
    };
  }
});
