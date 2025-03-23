import { z, ZodType } from 'zod';
import { User } from '../user/user.types.js';
import { InterComment } from '../interComment/interComment.types.js';

export const Vote: ZodType = z.lazy(() =>
  z.object({
    id: z.string(),
    value: z.boolean(),
    user: User,
    user_id: z.string(),
    comment: InterComment,
    comment_id: z.string(),
  })
);

export type VoteType = z.infer<typeof Vote>;