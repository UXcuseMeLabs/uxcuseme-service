import { z } from 'zod';
import { Vote } from '../vote/vote.types.js';
import { GameParameter } from '../gameParameter/gameParameter.types.js';
import { Birthday } from '../birthday/birthday.types.js';

const Provider = z.object({
  id: z.string(),
  name: z.string(),
});


const Account = z.object({
  id: z.string(),
  accountId: z.string(),
  provider: Provider,
  providerId: z.string(),
  userId: z.string(),
  accessToken: z.string().optional(),
  refreshToken: z.string().optional(),
  accessTokenExpiresAt: z.string().optional(),
  refreshTokenExpiresAt: z.string().optional(),
  scope: z.string().optional(),
  password: z.string().optional(),
  createdAt: z.date(),
  updatedAt: z.date(),
});

const Role = z.object({
  id: z.string(),
  name: z.string(),
});


const PlatformConfig = z.object({
  id: z.string(),
  authorization: z.boolean(),
  role: Role,
});

export const User = z.object({
  id: z.string(),
  display_name: z.string(),
  email: z.string(),
  email_verified: z.boolean(),
  image: z.string(),
  gameParameters: z.array(GameParameter),
  birthday: Birthday,
  votes: z.array(z.object({
    id: z.string(),
    value: z.number(),
    comment: z.string(),
  })),
  accounts: z.array(Account),
  platformConfigInterComment: PlatformConfig,
  platformConfigHome: PlatformConfig,
});


export type UserType = z.infer<typeof User>;