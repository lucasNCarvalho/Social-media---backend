import { prisma } from "@/lib/prisma";
import { RefreshTokenRepositoryInterface } from "./interfaces/refreshToken-repository-interface";
import { ResourceNotFoundError } from "@/services/erros/resource-not-found-error";



export class PrismaRefreshToken implements RefreshTokenRepositoryInterface {

    async create({ refreshToken, userId }: { refreshToken: string; userId: string }) {

        const existingToken = await prisma.refreshToken.findFirst({
            where: { userId }
        })

        if (existingToken) {
            await prisma.refreshToken.update({
                where: { id: existingToken.id },
                data: {
                    token: refreshToken,
                    revoked: false
                }
            })
            return
        }

        await prisma.refreshToken.create({
            data: {
                token: refreshToken,
                userId
            }
        })

    }


    async revokeByUserId(userId: string) {

        try {

            const existingToken = await prisma.refreshToken.findFirst({
                where: { userId }
            })

            await prisma.refreshToken.update({
                where: { id: existingToken?.id },
                data: { revoked: true }
            })

        } catch (error) {
            throw new ResourceNotFoundError()
        }
    }

    async revokeByRefreshToken(refreshToken: string) {
        try {
            await prisma.refreshToken.update({
                where: { token: refreshToken },
                data: { revoked: true }
            })

        } catch (error) {
            throw new ResourceNotFoundError()
        }
    }

    async getToken(refreshToken: string) {
        try {
            const storedToken = await prisma.refreshToken.findUnique({
                where: {token: refreshToken}
            })

            return storedToken
        } catch (error) {
            throw new ResourceNotFoundError()
        }
    }
}