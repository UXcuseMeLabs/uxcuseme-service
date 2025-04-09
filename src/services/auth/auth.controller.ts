import type { Context, Next } from "hono";
import prisma from "../../utils/prisma.js";
import jwt from 'jsonwebtoken';
import axios from "axios";


const TWITCH_CLIENT_ID = process.env.TWITCH_CLIENT_ID!;
const TWITCH_CLIENT_SECRET = process.env.TWITCH_CLIENT_SECRET!;
const TWITCH_REDIRECT_URI = process.env.TWITCH_REDIRECT_URI!;
const JWT_SECRET = process.env.JWT_SECRET!;

function generateJWT(userId: string) {
  return jwt.sign({ userId }, JWT_SECRET, { expiresIn: '1h' });
}

async function refreshAccessToken(refreshToken: string) {
  const response = await axios.post('https://id.twitch.tv/oauth2/token', null, {
    params: {
      grant_type: 'refresh_token',
      refresh_token: refreshToken,
      client_id: TWITCH_CLIENT_ID,
      client_secret: TWITCH_CLIENT_SECRET,
    },
  });

  return response.data;
}

export const callbackTwitch = async (c:Context) => {
  const state = c.req.query('state')
  const code = c.req.query('code');
  if (!code) return c.text('Código no proporcionado', 400);

  try {
    // Intercambia el código por un token de acceso
    const response = await axios.post('https://id.twitch.tv/oauth2/token', null, {
      params: {
        client_id: TWITCH_CLIENT_ID,
        client_secret: TWITCH_CLIENT_SECRET,
        code,
        grant_type: 'authorization_code',
        redirect_uri: TWITCH_REDIRECT_URI,
      },
    });

    const { access_token, refresh_token, expires_in } = response.data;

    // Obtener la información del usuario de Twitch
    const userResponse = await axios.get('https://api.twitch.tv/helix/users', {
      headers: {
        Authorization: `Bearer ${access_token}`,
        'Client-Id': TWITCH_CLIENT_ID,
      },
    });

    const userData = userResponse.data.data[0];
    const accountId = userData.id;
    const displayName = userData.display_name;
    const email = userData.email;
    const image = userData.profile_image_url;

    // Guardar o actualizar el usuario y el token en la base de datos
    const user = await prisma.user.upsert({
      where: { email },
      update: {
        display_name: displayName,
        image,
      },
      create: {
        display_name: displayName,
        email,
        email_verified: true,
        platformConfigHome: {
          create: {
            authorization: true,
            role: {
              connectOrCreate: {
                where: {name: 'member'},
                create: {
                  name: 'member'
                }
              }
            }
          }
        },
        platformConfigInterComment: {
          create: {
            authorization: true,
            role: {
              connectOrCreate: {
                where: {name: 'member'},
                create: {
                  name: 'member'
                }
              }
            }
          }
        },
        image,
        accounts: {
          create: {
            accountId,
            provider: { connectOrCreate: { where: { name: 'twitch' }, create: { name: 'twitch' } } },
            accessToken: access_token,
            refreshToken: refresh_token,
            accessTokenExpiresAt: new Date(Date.now() + expires_in * 1000),
            createdAt: new Date(),
            updatedAt: new Date(),
          },
        },
      },
    });

    // Generar el token JWT para el frontend
    const token = generateJWT(user.id);
    let redirectUrl = process.env.ORIGIN!;
    if (state) {
        try {
            const decodedState = JSON.parse(Buffer.from(state, 'base64').toString('utf8'));
            if (decodedState.redirect) {
                redirectUrl = decodedState.redirect;
            }
        } catch (error) {
            console.error('Error decodificando el state:', error);
        }
    }
    return c.redirect(process.env.ORIGIN! + '/?token=' + token + '&redirect=' + redirectUrl)
  } catch (error) {
    console.error('Error en la autenticación:', error);
    return c.text('Error en la autenticación', 500);
  }
}

export const middleWareRefreshToken = async (c: Context, next: Next ) => {
  const userId = c.get('userId');
  await refreshAccessToken(userId);
  await next();
}

export const middleWareProtectedRoute = async (c:Context, next: Next) => {
  const authHeader = c.req.header('Authorization');
  if (!authHeader) return c.text('Token no proporcionado', 401);
  console.log(authHeader)
  const token = authHeader.replace('Bearer ', '');
  try {
    jwt.verify(token, JWT_SECRET);
    await next();
  } catch (error) {
    return c.text('Token inválido o expirado', 401);
  }
}