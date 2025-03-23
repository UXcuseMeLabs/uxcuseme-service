import { z } from 'zod';
import { User } from '../user/user.types.js';
import { InterComment } from '../interComment/interComment.types.js';
import { Link } from '../link/link.types.js';
import { Theme } from '../theme/theme.types.js';

export const Board = z.object({
  id: z.string(),
  name: z.string(),
  user: User,
  interComments: z.array(InterComment),
  isLocked: z.boolean(),
  background: z.string(),
  links: z.array(Link),
  theme: Theme,
  createdAt: z.string(),
  updatedAt: z.string(),
});

export type BoardType = z.infer<typeof Board>;
