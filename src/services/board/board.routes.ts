import { Hono } from "hono";
import { createBoard, getBoardByTwitchId } from "./board.controller.js";




const boardRoutes = new Hono()


boardRoutes.post('/', createBoard)

boardRoutes.get('/:id', getBoardByTwitchId)


export default boardRoutes;