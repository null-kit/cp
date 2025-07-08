export default defineEventHandler(async (event) => {
  await requireAuth(event);

  const id = getRouterParam(event, 'id');

  await prisma.user
    .delete({ where: { id: Number(id) } })
    .catch((error) => createError({ status: 404, message: error }));

  return { message: 'Record deleted successfully' };
});
