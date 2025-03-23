import { Hono } from "hono";
import { createUser, getUserById } from "./user.controller.js";




const userRoutes = new Hono()


userRoutes.post('/', createUser)

userRoutes.get('/', getUserById)


export default userRoutes;