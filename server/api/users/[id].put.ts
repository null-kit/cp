import { userSchema } from '../../validation/user';

export default defineEventHandler(async (event) => {
  await requireAuth(event);

  const id = getRouterParam(event, 'id');
  const body = await readBody(event);
  const data = validateSchema(userSchema.safeParse(body));

  await prisma.user
    .update({
      where: { id: Number(id) },
      data
    })
    .catch((error) => {
      prismaValidate(error, 'email', 'Entered email already exist');

      throw createError({ status: 500, message: error });
    });

  return { message: 'Record updated successfully' };
});
