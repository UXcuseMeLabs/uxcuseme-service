import type { Context } from "hono";
import type { UserType } from "./user.types.js";
import prisma from "../../utils/prisma.js";
import jwt from 'jsonwebtoken'

export const createUser = async (c: Context) => {
    try {
        const body: UserType = await c.req.json();
        if (!body) return c.json({ message: "Missing data" }, 400);

        const user = await prisma.user.create({
            data: {
                ...body,
                platformConfigHome: {
                    create: {
                        id: body.platformConfigHome.id,
                        authorization: body.platformConfigHome.authorization,
                        role: {
                            connect: { id: body.platformConfigHome.role.id },
                        },
                    },
                },
                platformConfigInterComment: {
                    create: {
                        id: body.platformConfigHome.id,
                        authorization: body.platformConfigHome.authorization,
                        role: {
                            connect: { id: body.platformConfigHome.role.id },
                        },
                    },
                },
                accounts: {
                    connectOrCreate: body.accounts.map((account) => ({
                        where: { id: account.id },
                        create: {
                            id: account.id,
                            accountId: account.accountId,
                            createdAt: account.createdAt || new Date(),
                            updatedAt: account.updatedAt || new Date(),
                            provider: {
                                connect: { id: account.provider.id },
                            },
                        },
                    })),
                },
                votes: {
                    connectOrCreate: body.votes.map((vote) => ({
                        where: { id: vote.id },
                        create: {
                            id: vote.id,
                            value: vote.value,
                            comment: vote.comment,
                        },
                    })),
                },
                gameParameters: {
                    connectOrCreate: body.gameParameters?.map((param) => ({
                        where: { id: param.id },
                        create: {
                            id: param.id,
                            value: param.value,
                            name: param.name,
                            game_id: param.game_id,
                            user_id: param.user_id,
                        },
                    })),
                },
                birthday: {
                    connectOrCreate: {
                        where: { id: body.birthday.id },
                        create: {
                            id: body.birthday.id,
                            day: body.birthday.day,
                            month: body.birthday.month,
                            username: body.birthday.username,
                        },
                    },
                },
                
            },
            include: {
                gameParameters: true,
            },
        });

        return c.json(user);
    } catch (error) {
        return c.json({ message: "Error creating user", error: (error as Error).message }, 500);
    }
};


export const getUserById = async (c: Context) => {
    const token = c.req.header('Authorization')?.replace('Bearer ', '');
    const decodeToken = jwt.decode(token!)
    const userId = decodeToken?.sub as string

    try {
        const include= {
            platformConfigHome: true,
            platformConfigInterComment: true,
            accounts: {
                include: {
                    provider: true,

                }
            }
        }
        let user = await prisma.user.findFirst({
            where: {
                id: userId
            },
            include
        })

        if(!user){
            const account = await prisma.account.findFirst({
                where: {
                    accountId: userId
                }
            })
            user = await prisma.user.findFirst({
                where: {
                    id: account?.userId
                },
                include
            })
        }

        if (!user) {
            return c.json({ error: 'User not found' }, 404);
          }
        return c.json(user)
    } catch (error) {
        
    }
}