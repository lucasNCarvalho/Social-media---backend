import { PrismaFollowRepository } from "@/repositories/prisma/prisma-follow-repository"
import { FollowUserService } from "@/services/follow/follow"


export function makeFollowUserFactory() {
    const followRepository = new PrismaFollowRepository()
    return new FollowUserService(followRepository)
}