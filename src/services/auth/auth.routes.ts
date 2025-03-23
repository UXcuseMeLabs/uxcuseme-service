import { Hono, type Context } from "hono";
import { callbackTwitch, middleWareProtectedRoute, middleWareRefreshToken } from "./auth.controller.js";




const authRoutes = new Hono()

const TWITCH_CLIENT_ID = process.env.TWITCH_CLIENT_ID
const TWITCH_REDIRECT_URI = encodeURIComponent(process.env.TWITCH_REDIRECT_URI!)


authRoutes.get('/twitch', (c:Context) => {
    const url = `https://id.twitch.tv/oauth2/authorize?client_id=${TWITCH_CLIENT_ID}&redirect_uri=${TWITCH_REDIRECT_URI}&response_type=code&scope=user:read:email`;
    return c.redirect(url);
  });


authRoutes.get('/twitch/callback', callbackTwitch)

authRoutes.get('/protected/*', middleWareRefreshToken)
authRoutes.get('/protected/*', middleWareProtectedRoute)

authRoutes.get('/protected/user', async (c:Context) => {
    return c.json('Pasaste la ruta protegida')
})

export default authRoutes;