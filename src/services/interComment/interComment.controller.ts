import type { Context } from "hono";
import type { InterCommentType } from "./interComment.types.js";
import prisma from "../../utils/prisma.js";

export const createInterComment = async (ctx: Context) => {
  const body: InterCommentType = await ctx.req.json();
  const { createdAt, ...rest } = body;

  if (!body) {
    return ctx.json({ message: 'Missing data' }, 400);
  }

  try {
    const interComment = await prisma.interComment.create({
      data: rest as InterCommentType,
    });

    return ctx.json(interComment, 201);
  } catch (error) {
    console.log('error', error);
    return ctx.json({ message: (error as Error).message }, 500);
  }
};


export const deleteInterComments = async (ctx: Context) => {
  try {
    const deletedComment = await prisma.interComment.deleteMany();

    return ctx.json(deletedComment, 200);
  } catch (error) {
    return ctx.json({ message: (error as Error).message }, 500);
  }
};

export const deleteInterComment = async (ctx: Context) => {
  const { id } = ctx.req.param();

  try {
    const deletedComment = await prisma.interComment.delete({
      where: {
        id,
      },
    });

    return ctx.json(deletedComment, 200);
  } catch (error) {
    return ctx.json({ message: (error as Error).message }, 500);
  }
};

export const getInterComments = async (ctx: Context) => {
  const page = parseInt(ctx.req.query('page') || '1', 10);  // Página actual, predeterminada a 1
  const limit = parseInt(ctx.req.query('limit') || '10', 10);  // Límite de resultados por página, predeterminado a 10
  const skip = (page - 1) * limit;  // Calcular el desplazamiento

  try {
    const interComments = await prisma.interComment.findMany({
      skip,
      take: limit,
      include: {
        votes: true,
        user: true,
      },
      orderBy: {
        createdAt: 'desc',
      },
    });

    const totalComments = await prisma.interComment.count();  // Contar el total de comentarios

    return ctx.json({
      page,
      limit,
      totalPages: Math.ceil(totalComments / limit),
      totalComments,
      data: interComments,
    }, 200);
  } catch (error) {
    return ctx.json({ error: 'Error al obtener los comentarios' }, 500);
  }
};
