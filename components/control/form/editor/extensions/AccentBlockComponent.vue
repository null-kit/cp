<template>
  <node-view-wrapper>
    <div
      class="flex justify-between items-center px-2 py-1 ring-1 ring-slate-200 rounded-t-xl mx-3 control-pattern-lines"
    >
      <div class="font-medium text-sm">Accent Block</div>

      <div @click="handleDelete" class="text-sm hover:text-red-500 text-slate-400 duration-200 cursor-pointer">
        Delete
      </div>
    </div>

    <div class="accent-block">
      <node-view-content />
    </div>
  </node-view-wrapper>
</template>

<script setup>
import { NodeViewWrapper, NodeViewContent } from '@tiptap/vue-3';

const props = defineProps({
  node: {
    type: Object,
    required: true
  },
  deleteNode: {
    type: Function
  }
});

const handleDelete = () => {
  props.deleteNode();
};
</script>
