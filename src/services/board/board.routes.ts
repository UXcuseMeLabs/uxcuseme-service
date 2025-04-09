import { Hono } from "hono";
import { createBoard, getBoardByTwitchId } from "./board.controller.js";
import { zValidator } from "@hono/zod-validator";
import { Board } from "./board.types.js";




const boardRoutes = new Hono()


boardRoutes.post('/', createBoard, zValidator('json', Board))

boardRoutes.get('/:id', getBoardByTwitchId)


export default boardRoutes;