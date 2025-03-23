import type { Context } from "hono";
import type { ThemeType } from "./theme.types.js";
import prisma from "../../utils/prisma.js";

export const createTheme = async (ctx: Context) => {
  const body = await ctx.req.json() as ThemeType;
  
  try {
    const theme = await prisma.theme.create({
      data: body,
    });

    return ctx.json(theme, 201);
  } catch (error) {
    return ctx.json({ error: 'Error al crear el tema' }, 500);
  }
};
