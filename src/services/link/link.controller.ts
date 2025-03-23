import type { Context } from "hono";
import type { LinkType } from "./link.types.js";
import prisma from "../../utils/prisma.js";


export const createLink = async (ctx: Context) => {
  const body: LinkType = await ctx.req.json(); // Obtenemos el cuerpo de la solicitud

  try {
    const link = await prisma.link.create({
      data: body,
    });

    return ctx.json(link, 201); // Devolvemos el enlace con código 201
  } catch (error) {
    return ctx.json({ error: 'Error al crear el enlace' }, 500); // Respuesta de error en caso de fallo
  }
};
