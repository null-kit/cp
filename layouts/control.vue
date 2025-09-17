<template>
  <ClientOnly>
    <div class="control-bg-dot isolate min-h-dvh bg-slate-50 text-sm text-slate-800">
      <div v-if="hasAuth" class="mx-auto max-w-7xl px-4">
        <ControlHeader />

        <main class="grid grid-cols-1 items-start gap-8 pb-8">
          <slot />
        </main>
      </div>

      <main v-else class="p-5 md:py-14">
        <section class="mx-auto max-w-4xl rounded-3xl bg-white py-10 shadow ring-1 ring-slate-200 md:py-16">
          <div class="mb-10 flex justify-center">
            <img
              v-if="control?.logo?.path"
              :src="control?.logo?.path"
              :class="control?.logo?.class || 'h-7'"
              alt="Logo"
            />
          </div>

          <form class="mx-auto max-w-md space-y-8 px-6" @submit.prevent="login(formData)">
            <ControlFormInput v-model="formData.email" name="email" type="text" placeholder="Enter Email" />

            <ControlFormInput
              v-model="formData.password"
              name="password"
              type="password"
              placeholder="Enter Password"
            />

            <div class="text-center">
              <button type="submit" class="control-btn control-btn-main w-44">Login</button>
            </div>
          </form>
        </section>
      </main>
    </div>
  </ClientOnly>
</template>

<script setup lang="ts">
const { app } = useRuntimeConfig().public;
const { control } = useAppConfig();

const { hasAuth, login } = useControlSession();

useHead({
  title: 'Dashboard',
  titleTemplate: `%s - Control ${app && '- ' + app.name}`,
  meta: [
    { name: 'robots', content: 'noindex, nofollow' },
    { name: 'color-scheme', content: 'light' }
  ]
});

const formData = reactive({ email: '', password: '' });

const gradientBorder = (event: MouseEvent) => {
  const cards = document.querySelectorAll<HTMLElement>('[data-radial]');

  if (!cards) return;

  for (const card of cards) {
    const rect = card.getBoundingClientRect();
    const x = event.clientX - rect.left;
    const y = event.clientY - rect.top;

    card.style.setProperty('--mouse-x', `${x}px`);
    card.style.setProperty('--mouse-y', `${y}px`);
  }
};

onMounted(() => document.body.addEventListener('mousemove', gradientBorder));
onUnmounted(() => document.body.removeEventListener('mousemove', gradientBorder));
</script>
