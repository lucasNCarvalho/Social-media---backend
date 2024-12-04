import { PrismaUserRepository } from "@/repositories/prisma/prisma-users-repository"
import { RegisterUserService } from "../user/registerUserService"
import { UpdateUserService } from "../user/update"



export function makeUpdateUserFactory() {
    const prismaUserRepository = new PrismaUserRepository()
    return new UpdateUserService(prismaUserRepository)


}