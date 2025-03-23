import type { Vote } from "@prisma/client/wasm";
import type { Context } from "hono";
import prisma from "../../utils/prisma.js";

export const createVote = async (ctx: Context) => {
  try {
    const body: Vote = await ctx.req.json(); // Obtenemos el cuerpo de la solicitud
    
    const vote = await prisma.vote.create({
      data: body,
    });

    return ctx.json(vote, 201); // Devolvemos el voto con código 201
  } catch (error) {
    return ctx.json({ error: 'Error al crear el voto' }, 500); // Respuesta de error en caso de fallo
  }
};
