import { z } from 'zod'

export const Game = z.object({
    id: z.string(),
    name: z.string(),
})

export type GameType = z.infer<typeof Game>

export const GameParameter = z.object({
    id: z.string(),
    value: z.number().int(),
    name: z.string(),
    game_id: z.string(),
    user_id: z.string(),
    game: Game,
})

export type GameParameterType = z.infer<typeof GameParameter>