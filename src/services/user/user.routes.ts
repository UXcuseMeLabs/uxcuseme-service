import { Hono } from "hono";
import { createUser, getUserById } from "./user.controller.js";
import { middleWareProtectedRoute } from "../auth/auth.controller.js";
import { describeRoute } from "hono-openapi";
import { resolver } from "hono-openapi/zod";
import { User } from "./user.types.js";




const userRoutes = new Hono()

userRoutes

userRoutes.post('/', createUser,   describeRoute({
    description: 'Say hello to the user',
    requestBody: {
      content: {
        'application/json': {
          schema: resolver(User),
        },
      },
    },
    responses: {
      200: {
        description: 'Successful response',
        content: {
          'text/plain': { schema: resolver(User) },
        },
      },
    },
  }),)

userRoutes.get('/*', middleWareProtectedRoute)
userRoutes.get('/', getUserById)



export default userRoutes;