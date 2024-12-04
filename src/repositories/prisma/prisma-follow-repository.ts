
import { prisma } from "@/lib/prisma";
import { FollowRepositoryInterface } from "./interfaces/follow-repository-interface";


export class PrismaFollowRepository implements FollowRepositoryInterface {

    async getFollowersCount(userId: string) {
 
        return await prisma.follow.count({
            where: {
                followingId: userId,
            },
        });
    }


    async getFollowingCount(userId: string) {
        return await prisma.follow.count({
            where: {
                followerId: userId,
            },
        });

    }

    async isFollowing(userId: string, loggedUserId: string) {
        const follow = await prisma.follow.findFirst({
            where: {
                followerId: loggedUserId,
                followingId: userId,
            },
        });

        return !!follow;
    }

    async followUser(loggedUserId: string, userId: string): Promise<void> {
        await prisma.follow.create({
            data: {
                followerId: loggedUserId,
                followingId: userId,
            },
        });
    }

    async unfollowUser(loggedUserId: string, userId: string): Promise<void> {
        await prisma.follow.deleteMany({
            where: {
                followerId: loggedUserId,
                followingId: userId,
            },
        });
    }

}