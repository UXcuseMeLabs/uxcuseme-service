import type { Context } from "hono";

export const createUser = (c: Context) => {

    return c.json({
        message: 'User created'
    })
}