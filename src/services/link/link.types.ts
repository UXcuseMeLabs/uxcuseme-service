import { z } from 'zod';

export const Link = z.object({
  id: z.string(),
  url: z.string(),
  name: z.string(),
  board_id: z.string(),
  createdAt: z.string(),
  updatedAt: z.string(),
});

export type LinkType = z.infer<typeof Link>;
