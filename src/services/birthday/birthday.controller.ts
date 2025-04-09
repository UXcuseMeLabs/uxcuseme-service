import type { Context } from "hono";
import type { BirthdayType } from "./birthday.types.js";
import prisma from "../../utils/prisma.js";

export const createBirthday = async (ctx: Context) => {
  const body = await ctx.req.json() as BirthdayType;
  
  if (!body) {
    return ctx.json({ message: 'Missing data' }, 400);
  }

  try {
    const birthday = await prisma.birthday.create({
      data: body,
      include: {
        user: true,
      },
    });

    return ctx.json(birthday, 201);
  } catch (error) {
    return ctx.json({ error: 'Error al crear el cumpleaños' }, 500);
  }
};


export const getBirthdayById = async (ctx: Context) => {
  const id = ctx.req.param('id');
  
  try {
    const user = await prisma.user.findFirst({
      where: {
        accounts: {
          some: {
            provider: {
              name: 'twitch',
            },
            accountId: id,
          }
        }
      },
      include: {
        birthday: true,
      },
    });

    if (!user?.birthday) {
      return ctx.notFound(); // En Hono usamos `ctx.notFound()` para respuestas 404
    }

    return ctx.json(user.birthday, 200);
  } catch (error) {
    return ctx.json({ error: 'Error al obtener el cumpleaños' }, 500);
  }
};
