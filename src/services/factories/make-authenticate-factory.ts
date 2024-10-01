import { PrismaRefreshToken } from "@/repositories/prisma/prisma-refreshToken-repository"
import { PrismaUserRepository } from "@/repositories/prisma/prisma-users-repository"
import { AuthenticateService } from "../user/authenticate"


export function makeAuthenticateFactory() {
    const prismaUsersRepository = new PrismaUserRepository()
    const prismaRefreshTokenRepository = new PrismaRefreshToken()
    const authenticateService = new AuthenticateService(prismaUsersRepository, prismaRefreshTokenRepository )

    return authenticateService
}