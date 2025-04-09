import { Hono } from "hono";
import { createLink } from "./link.controller.js";
import { zValidator } from '@hono/zod-validator';
import { Link } from "./link.types.js";




const linkRoutes = new Hono()


linkRoutes.post('/', createLink, zValidator('json', Link))


export default linkRoutes;