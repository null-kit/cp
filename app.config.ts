export default defineAppConfig({
  control: {
    logo: {
      path: '/logo/primary.svg',
      class: 'h-6'
    },
    navigation: [
      {
        name: 'Users',
        link: '/control/users'
      }
    ]
  }
});

declare module '@nuxt/schema' {
  interface AppConfigInput {
    control: {
      logo: {
        path: string;
        class: string;
      };
      navigation: {
        name: string;
        link?: string;
        dropdown?: {
          name: string;
          link: string;
        }[];
      }[];
    };
  }
}
