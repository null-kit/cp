import { z } from 'zod';

/** Optional publish time; the client sends an ISO string, Prisma receives a Date. */
export const publishAtSchema = z.iso
  .datetime('Please select publish time')
  .transform((value) => new Date(value))
  .nullish();

type Scheduled<T> = T & { publishAt?: Date | null };

/**
 * Adds scheduled publishing to an object schema: a `publishAt` field, and when it is set
 * the record is forced hidden (until the `cp:publish` task runs) and dated by its publish time.
 */
export const withSchedule = <Shape extends z.ZodRawShape>(schema: z.ZodObject<Shape>) =>
  schema.extend({ publishAt: publishAtSchema }).transform((data) => {
    const { publishAt } = data as Scheduled<typeof data>;

    return publishAt ? { ...data, hidden: true, date: publishAt } : data;
  });
