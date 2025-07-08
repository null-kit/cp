import { Node, mergeAttributes } from '@tiptap/core';
import { VueNodeViewRenderer } from '@tiptap/vue-3';
import FaqComponent from '@/components/control/form/editor/extensions/FaqComponent.vue';

export interface Options {
  HTMLAttributes: Record<string, any>;
}

declare module '@tiptap/core' {
  interface Commands<ReturnType> {
    faqComponent: {
      setFaq: (attributes: { question: string; answer: string }) => ReturnType;
    };
  }
}

export const FaqExtension = Node.create<Options>({
  name: 'faqComponent',
  group: 'block',
  content: 'paragraph+',
  selectable: true,

  addAttributes() {
    return {
      question: {
        default: null,
        parseHTML: (element) => element.getAttribute('data-question'),
        renderHTML: (attributes) => {
          if (!attributes.question) return {};
          return { 'data-question': attributes.question };
        }
      },
      answer: {
        default: null,
        parseHTML: (element) => element.getAttribute('data-answer'),
        renderHTML: (attributes) => {
          if (!attributes.answer) return {};
          return { 'data-answer': attributes.answer };
        }
      }
    };
  },

  parseHTML() {
    return [
      {
        tag: 'div[data-type="faq"]',
        getAttrs: (element) => {
          if (typeof element === 'string') return {};
          const el = element as HTMLElement;
          return {
            question: el.getAttribute('data-question'),
            answer: el.getAttribute('data-answer')
          };
        }
      }
    ];
  },

  renderHTML({ HTMLAttributes, node }) {
    return [
      'div',
      mergeAttributes(
        { 'data-type': 'faq', itemscope: '', itemprop: 'mainEntity', itemtype: 'https://schema.org/Question' },
        HTMLAttributes
      ),
      ['strong', { itemprop: 'name' }, node.attrs.question || ''],
      [
        'div',
        { itemscope: '', itemprop: 'acceptedAnswer', itemtype: 'https://schema.org/Answer' },
        ['div', { itemprop: 'text' }, ['p', node.attrs.answer || '']]
      ]
    ];
  },

  addNodeView() {
    return VueNodeViewRenderer(FaqComponent as any);
  },

  addCommands() {
    return {
      setFaq:
        (attributes) =>
        ({ chain }) => {
          return chain()
            .insertContent({
              type: this.name,
              attrs: attributes,
              content: [
                { type: 'paragraph', content: [{ type: 'text', text: attributes.question || ' ' }] },
                { type: 'paragraph', content: [{ type: 'text', text: attributes.answer || ' ' }] }
              ]
            })
            .focus()
            .run();
        }
    };
  }
});
