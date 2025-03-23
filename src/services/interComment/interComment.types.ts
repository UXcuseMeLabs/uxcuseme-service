import { z } from 'zod';
import { Vote } from '../vote/vote.types.js';

export const InterComment = z.lazy(() =>
  z.object({
    id: z.string(),
    comment: z.string(),
    user_id: z.string(),
    username: z.string(),
    votes: Vote,
    createdAt: z.date(),
  })
);

export type InterCommentType = z.infer<typeof InterComment>;