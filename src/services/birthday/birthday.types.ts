import { z } from 'zod';

export const Birthday = z.object({
  id: z.string(),
  day: z.number().int(),
  month: z.number().int(),
  user_id: z.string(),
  username: z.string(),
});

export type BirthdayType = z.infer<typeof Birthday>;