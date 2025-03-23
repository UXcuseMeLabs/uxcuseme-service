import { Hono } from "hono";
import { createTheme } from "./theme.controller.js";




const themeRoutes = new Hono()


themeRoutes.post('/', createTheme)


export default themeRoutes;