import { Hono } from "hono";
import { createBirthday, getBirthdayById } from "./birthday.controller.js";
import { zValidator } from "@hono/zod-validator";
import { Birthday } from "./birthday.types.js";




const birthdayRoutes = new Hono()


birthdayRoutes.post('/', createBirthday, zValidator('json', Birthday))

birthdayRoutes.get('/:id', getBirthdayById)


export default birthdayRoutes;