export default defineEventHandler(async (event) => {
  await requireAuth(event);

  const id = getRouterParam(event, 'id');

  const record = await prisma.user.findUnique({
    where: {
      id: Number(id)
    },
    select: {
      id: true,
      name: true,
      email: true
    }
  });

  if (!record) throw createError({ status: 404, statusMessage: 'Record not found' });

  return record;
});
