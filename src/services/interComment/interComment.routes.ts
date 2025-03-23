import { Hono } from "hono";
import { createInterComment, deleteInterComment, deleteInterComments, getInterComments } from "./interComment.controller.js";




const interCommentRoutes = new Hono()


interCommentRoutes.post('/', createInterComment)

interCommentRoutes.delete('/:id', deleteInterComment)

interCommentRoutes.delete('/', deleteInterComments)

interCommentRoutes.get('/', getInterComments)




export default interCommentRoutes;