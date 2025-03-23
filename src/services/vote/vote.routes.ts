import { Hono } from "hono";
import { createVote } from "./vote.controller.js";
import { zValidator } from "@hono/zod-validator";
import { Vote } from "./vote.types.js";




const voteRoutes = new Hono()


voteRoutes.post('/', createVote, zValidator('json', Vote))


export default voteRoutes;