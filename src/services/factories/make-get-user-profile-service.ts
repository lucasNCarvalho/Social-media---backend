import { PrismaUserRepository } from "@/repositories/prisma/prisma-users-repository"
import { GetUserProfileService } from "../user/get-user-profile"


export function makeGetUserProfileService() {
    const userRepository = new PrismaUserRepository()
    const userPorifle = new GetUserProfileService(userRepository)

    return userPorifle
}