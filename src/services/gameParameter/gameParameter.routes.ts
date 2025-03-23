import { Hono } from "hono";
import { createUser } from "./gameParameter.controller.js";




const userRoutes = new Hono()


userRoutes.post('/', createUser)


export default userRoutes;