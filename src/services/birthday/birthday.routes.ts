import { Hono } from "hono";
import { createBirthday, getBirthdayById } from "./birthday.controller.js";




const birthdayRoutes = new Hono()


birthdayRoutes.post('/', createBirthday)

birthdayRoutes.get('/:id', getBirthdayById)


export default birthdayRoutes;