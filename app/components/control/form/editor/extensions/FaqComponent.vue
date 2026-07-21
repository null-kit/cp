<template>
  <node-view-wrapper class="py-2">
    <div class="space-y-3 rounded-xl bg-white p-3 shadow ring-1 ring-slate-200">
      <div class="flex items-center justify-between">
        <div class="text-sm font-medium">QA Block</div>

        <div @click="handleDelete" class="cursor-pointer text-sm text-slate-400 duration-200 hover:text-red-500">
          Delete
        </div>
      </div>

      <input
        type="text"
        :value="node.attrs.question"
        @input="updateQuestion"
        @keydown.enter.prevent
        placeholder="Enter question"
        class="control-form-input"
      />

      <input
        type="text"
        :value="node.attrs.answer"
        @input="updateAnswer"
        @keydown.enter.prevent
        placeholder="Enter answer"
        class="control-form-input"
      />
    </div>
  </node-view-wrapper>
</template>

<script setup>
import { NodeViewWrapper } from '@tiptap/vue-3';

const props = defineProps({
  node: {
    type: Object,
    required: true
  },
  updateAttributes: {
    type: Function,
    required: true
  },
  deleteNode: {
    type: Function
  }
});

const updateQuestion = (event) => {
  props.updateAttributes({
    question: event.target.value
  });
};

const updateAnswer = (event) => {
  props.updateAttributes({
    answer: event.target.value
  });
};

const handleDelete = () => {
  props.deleteNode();
};
</script>
