<template>
  <div class="control-btn-group">
    <button type="button" class="control-btn control-btn-sm" @click="runCommand((chain) => chain.addColumnBefore())">
      <ControlIcon name="cell-left-add" />
    </button>

    <button type="button" class="control-btn control-btn-sm" @click="runCommand((chain) => chain.addColumnAfter())">
      <ControlIcon name="cell-right-add" />
    </button>

    <button type="button" class="control-btn control-btn-sm" @click="runCommand((chain) => chain.deleteColumn())">
      <ControlIcon name="cell-right-remove" />
    </button>

    <div class="w-1" />

    <button type="button" class="control-btn control-btn-sm" @click="runCommand((chain) => chain.addRowBefore())">
      <ControlIcon name="row-top-add" />
    </button>

    <button type="button" class="control-btn control-btn-sm" @click="runCommand((chain) => chain.addRowAfter())">
      <ControlIcon name="row-bottom-add" />
    </button>

    <button type="button" class="control-btn control-btn-sm" @click="runCommand((chain) => chain.deleteRow())">
      <ControlIcon name="row-bottom-remove" />
    </button>

    <div class="w-1" />

    <button
      type="button"
      class="control-btn control-btn-default control-btn-sm"
      @click="runCommand((chain) => chain.mergeOrSplit())"
    >
      <ControlIcon name="join" />
    </button>
  </div>
</template>

<script setup lang="ts">
import type { Editor } from '@tiptap/vue-3';

const { editor } = defineProps<{ editor: Editor }>();

const runCommand = (command: (chain: ReturnType<Editor['chain']>) => ReturnType<Editor['chain']>) => {
  command(editor.chain().focus()).run();
};
</script>
