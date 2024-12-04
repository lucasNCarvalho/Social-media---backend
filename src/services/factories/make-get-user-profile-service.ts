import { PrismaUserRepository } from "@/repositories/prisma/prisma-users-repository"
import { GetUserProfileService } from "../user/get-user-profile"
import { PrismaFollowRepository } from "@/repositories/prisma/prisma-follow-repository"


export function makeGetUserProfileService() {
    const userRepository = new PrismaUserRepository()
    const followRepository = new PrismaFollowRepository()
    const userPorifle = new GetUserProfileService(userRepository, followRepository)

    return userPorifle
}