import { PrismaFollowRepository } from "@/repositories/prisma/prisma-follow-repository"
import { GetFollowService } from "@/services/follow/get"


export function makeGetFollowFactory() {
    const followRepository = new PrismaFollowRepository()
    return new GetFollowService(followRepository)
}