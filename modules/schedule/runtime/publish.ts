import { defineTask, prisma, useRuntimeConfig } from '#imports';

type PublishDelegate = {
  updateMany: (args: {
    where: { hidden: boolean; publishAt: { lte: Date } };
    data: { hidden: boolean; publishAt: null };
  }) => Promise<{ count: number }>;
};

export default defineTask({
  meta: { name: 'cp:publish' },
  async run() {
    const { models } = useRuntimeConfig().cp.schedule as { models: string[] };
    const now = new Date();

    const counts = await Promise.all(
      models.map(async (model) => {
        const delegate = (prisma as unknown as Record<string, PublishDelegate>)[model];

        if (!delegate) throw new Error(`[cp:publish] Unknown Prisma model "${model}"`);

        const { count } = await delegate.updateMany({
          where: { hidden: true, publishAt: { lte: now } },
          data: { hidden: false, publishAt: null }
        });

        return [model, count] as const;
      })
    );

    return { result: Object.fromEntries(counts) };
  }
});
