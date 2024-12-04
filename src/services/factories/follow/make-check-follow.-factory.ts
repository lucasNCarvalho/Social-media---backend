import { PrismaFollowRepository } from "@/repositories/prisma/prisma-follow-repository"
import { CheckFollowService } from "@/services/follow/checkFollow"


export function makeCheckFollowFactory() {
    const followRepository = new PrismaFollowRepository()
    return new CheckFollowService(followRepository)
}