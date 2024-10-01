import { PrismaUserRepository } from "@/repositories/prisma/prisma-users-repository"
import { RegisterUserService } from "../user/registerUserService"



export function makeRegisterUserFactory() {
    const prismaUserRepository = new PrismaUserRepository()
    const userService = new RegisterUserService(prismaUserRepository)

    return userService
}