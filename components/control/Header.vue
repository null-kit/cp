<template>
  <header class="relative z-10 flex flex-wrap items-center justify-between gap-4 py-8">
    <div class="flex shrink-0 items-center gap-5">
      <NuxtLink to="/" title="Go to Homepage">
        <img v-if="control?.logo?.path" :src="control?.logo?.path" :class="control?.logo?.class || 'h-7'" alt="Logo" />

        <span v-else-if="app?.name" class="text-2xl font-semibold">
          {{ app.name }}
        </span>

        <span v-else class="text-2xl font-semibold">Control Panel</span>
      </NuxtLink>
    </div>

    <nav
      v-if="control && control?.navigation"
      class="relative mx-auto min-w-0 rounded-full p-px max-sm:order-1"
      @mouseleave="control.navigation.forEach((link) => (link.isActive = false))"
      data-radial
    >
      <div class="flex max-w-sm gap-1 overflow-auto rounded-full bg-white p-1 shadow lg:max-w-none">
        <NuxtLink
          to="/control"
          active-class="pointer-events-none"
          class="flex rounded-full px-4 py-1 text-slate-400 ring-slate-200 duration-200 hover:text-black hover:ring-1"
        >
          <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 576 512" class="m-auto size-4">
            <path
              fill="currentColor"
              d="M272.5 5.7c9-7.6 22.1-7.6 31.1 0l264 224c10.1 8.6 11.4 23.7 2.8 33.8s-23.7 11.3-33.8 2.8L512 245.5V432c0 44.2-35.8 80-80 80H144c-44.2 0-80-35.8-80-80V245.5L39.5 266.3c-10.1 8.6-25.3 7.3-33.8-2.8s-7.3-25.3 2.8-33.8l264-224zM288 55.5L112 204.8V432c0 17.7 14.3 32 32 32h48V312c0-22.1 17.9-40 40-40H344c22.1 0 40 17.9 40 40V464h48c17.7 0 32-14.3 32-32V204.8L288 55.5zM240 464h96V320H240V464z"
            />
          </svg>
        </NuxtLink>

        <div v-for="menu in control.navigation" :key="menu">
          <NuxtLink
            :to="menu.link"
            active-class="ring-1 ring-slate-200 shadow pointer-events-none"
            class="block cursor-pointer rounded-full px-4 py-1.5 whitespace-nowrap ring-slate-200 duration-200 hover:ring-1"
            @mouseover="
              control.navigation.forEach((link) => (link.isActive = false));
              menu.isActive = true;
            "
          >
            {{ menu.name }}
          </NuxtLink>
        </div>
      </div>

      <template v-for="menu in control?.navigation" :key="menu">
        <Transition
          enter-from-class="-translate-y-5 opacity-0 duration-300"
          enter-to-class="translate-x-0 opacity-100 duration-300"
          leave-to-class="-translate-y-5 opacity-0 duration-300"
          mode="out-in"
        >
          <div
            v-if="menu.dropdown && menu.isActive"
            class="absolute inset-x-8 -z-10 -ml-2 rounded-b-2xl p-px"
            data-radial
          >
            <div class="grid gap-2 rounded-b-[15px] bg-white p-2 shadow-md" @mouseleave="menu.isActive = false">
              <NuxtLink
                v-for="submenu in menu.dropdown"
                :to="submenu.link"
                active-class="ring-1 shadow pointer-events-none"
                class="block rounded-xl px-4 py-1.5 ring-slate-200 duration-200 hover:ring-1"
              >
                {{ submenu.name }}
              </NuxtLink>
            </div>
          </div>
        </Transition>
      </template>
    </nav>

    <div class="rounded-full p-px" data-radial>
      <div class="flex items-center overflow-hidden rounded-full bg-white shadow">
        <div class="cursor-default truncate py-2 pl-4">
          {{ session.name }}
        </div>

        <button
          type="button"
          @click="logout"
          class="flex shrink-0 bg-white/95 p-3 pr-4 text-slate-400 duration-200 hover:text-orange-600"
        >
          <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 512 512" class="m-auto size-4">
            <path
              fill="currentColor"
              d="M256 56a24 24 0 1 1 48 0 24 24 0 1 1 -48 0zm80 0A56 56 0 1 0 224 56a56 56 0 1 0 112 0zM179.4 116.4c-12.7-3.2-26.1-3.2-38.8 0l-1.5 .4c-12.3 3.1-23.7 9-33.3 17.4L53.5 180c-6.7 5.8-7.3 15.9-1.5 22.6s15.9 7.3 22.6 1.5l52.4-45.8c5.7-5 12.6-8.6 20-10.4l1.5-.4c7.6-1.9 15.6-1.9 23.3 0l16.9 4.2L153.2 257.9c-7.3 21.8 2 45.7 22 57l93.3 52.5L224.9 490.7c-2.9 8.3 1.4 17.5 9.8 20.4s17.5-1.4 20.4-9.8L298.6 378c5.2-14.7-.9-30.9-14.5-38.5l-37.5-21.1c.2-.4 .4-.9 .5-1.3l37.2-111.6L298 253.2c5.9 20.6 24.7 34.8 46.2 34.8H400c8.8 0 16-7.2 16-16s-7.2-16-16-16H344.1c-7.1 0-13.4-4.7-15.4-11.6l-20.3-71c-4.7-16.5-17.9-29.2-34.5-33.4l-94.5-23.6zm83 53.7L218.3 302.4 190.9 287c-6.7-3.8-9.8-11.7-7.3-19l36.2-108.6 42.7 10.7zM130 314.1L101.3 384H16c-8.8 0-16 7.2-16 16s7.2 16 16 16h85.3c13 0 24.7-7.8 29.6-19.8l23.3-56.6c-10-6.7-18.2-15.5-24.1-25.4zM458.5 444.2C445.6 480 433.6 480 432 480h0 0c-1.6 0-13.6 0-26.4-35.8c-9.4-26.3-16.8-66.4-19.9-124.2h-32c7.3 140.7 39.7 192 78.4 192c44.2 0 80-66.6 80-256S476.2 0 432 0c-41.6 0-75.8 59-79.6 224h32c1.8-75.3 10.1-125.3 21.2-156.2C418.4 32 430.4 32 432 32l0 0 0 0c1.6 0 13.6 0 26.4 35.8C471.1 102.9 480 162.5 480 256s-8.9 153.1-21.5 188.2z"
            />
          </svg>
        </button>
      </div>
    </div>
  </header>
</template>

<script setup lang="ts">
const { control } = useAppConfig();
const { app } = useRuntimeConfig().public;
const { session, logout } = useControlSession();

const navActive = ref(true);

onMounted(() => {
  if (window.innerWidth < 768) navActive.value = false;

  window.addEventListener('resize', () => {
    navActive.value = window.innerWidth >= 768;
  });
});
</script>
