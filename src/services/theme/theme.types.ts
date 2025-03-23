import { z } from 'zod';

export const Theme = z.object({
  id: z.string(),
  name: z.string(),
  color: z.string(),
});

export type ThemeType = z.infer<typeof Theme>;
