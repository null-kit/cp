export default defineEventHandler(async (event) => {
  await requireAuth(event);

  return prisma.user.findMany({
    select: {
      id: true,
      name: true,
      email: true
    },
    orderBy: { createdAt: 'desc' }
  });
});
