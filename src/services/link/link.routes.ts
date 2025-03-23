import { Hono } from "hono";
import { createLink } from "./link.controller.js";
import { zValidator } from '@hono/zod-validator';
import { User } from "../user/user.types.js";




const linkRoutes = new Hono()


linkRoutes.post('/', createLink, zValidator('json', User))


export default linkRoutes;