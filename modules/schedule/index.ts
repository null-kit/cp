import { createResolver, defineNuxtModule } from 'nuxt/kit';

export interface ScheduleOptions {
  /** Prisma model delegates to auto-publish, e.g. `['post']`. Each needs `hidden` and `publishAt` fields. */
  models: string[];
  /** Cron expression for the publish task. Defaults to hourly. */
  cron: string;
}

export interface ModuleOptions {
  schedule?: Partial<ScheduleOptions>;
}

/**
 * Scheduled publishing. Enabled by listing models in the consumer config:
 *
 *   cp: { schedule: { models: ['post'] } }
 *
 * Registers the `cp:publish` Nitro task, which un-hides records whose `publishAt` has passed.
 */
export default defineNuxtModule<ModuleOptions>({
  meta: { name: 'cp', configKey: 'cp' },
  defaults: { schedule: { models: [], cron: '0 * * * *' } },
  setup(options, nuxt) {
    const models = options.schedule?.models ?? [];

    if (models.length === 0) return;

    const { resolve } = createResolver(import.meta.url);
    const cron = options.schedule?.cron ?? '0 * * * *';

    nuxt.options.runtimeConfig.cp = { schedule: { models } };

    nuxt.hook('nitro:config', (config) => {
      config.experimental = { ...config.experimental, tasks: true };
      config.tasks = {
        ...config.tasks,
        'cp:publish': {
          handler: resolve('./runtime/publish'),
          description: 'Publish scheduled records whose publishAt has passed'
        }
      };
      config.scheduledTasks = {
        ...config.scheduledTasks,
        [cron]: [...[config.scheduledTasks?.[cron] ?? []].flat(), 'cp:publish']
      };
    });
  }
});
