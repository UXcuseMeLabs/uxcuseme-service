import { type Context } from 'hono';
import prisma from '../../utils/prisma.js';
import type { Board } from '@prisma/client/edge';

export const createBoard = async (ctx: Context) => {
  const body: Board = await ctx.req.json();
  
  if (!body) {
    return ctx.json({ message: 'Missing data' }, 400);
  }

  try {
    const board = await prisma.board.create({
      data: body as Board,
    });

    return ctx.json(board, 201);
  } catch (error) {
    return ctx.json({ message: (error as Error).message }, 500);
  }
};

export const getBoardByTwitchId = async (ctx: Context) => {
  const { id } = ctx.req.param();
  
  const interComments = await prisma.board.findFirst({
    include: {
      user: true,
      links: true,
      theme: true,
      interComments: {
        include: {
          votes: true
        },
        orderBy: {
          createdAt: 'desc'
        }
      }
    },
    where: {
      user: {
        display_name: id
      }
    },
    orderBy: {
      createdAt: 'desc'
    }
  });

  if (!interComments) {
    return ctx.json({ message: 'Board not found' }, 404);
  }

  return ctx.json(interComments, 200);
};
