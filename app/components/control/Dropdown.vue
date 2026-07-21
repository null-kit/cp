<template>
  <div class="relative">
    <div ref="reference" @click="isOpen = !isOpen">
      <slot name="trigger" />
    </div>

    <Transition
      enter-from-class="opacity-0 -translate-y-2"
      leave-to-class="opacity-0 -translate-y-2"
      class="duration-200"
    >
      <div
        v-if="isOpen"
        class="absolute top-full z-1 mt-2 w-fit space-y-2 rounded-xl bg-white shadow ring ring-slate-200"
        @click.stop
      >
        <slot />
      </div>
    </Transition>
  </div>
</template>

<script setup lang="ts">
const isOpen = ref(false);

const reference = useTemplateRef<HTMLDivElement>('reference');

const onClickOutside = (event: MouseEvent) => {
  if (!isOpen.value || reference.value?.contains(event.target as Node)) return;

  isOpen.value = false;
};

onMounted(() => document.addEventListener('click', onClickOutside));
onBeforeUnmount(() => document.removeEventListener('click', onClickOutside));
</script>
