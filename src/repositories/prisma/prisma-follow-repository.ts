
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

    async getFollowers(userId: string) {
        const followers = await prisma.follow.findMany({
            where: {
                followingId: userId,
            },
            select: {
                follower: {
                    select: {
                        id: true,
                        name: true,
                        userName: true,
                        imageUrl: true,
                    },
                },
            },
        });
    
        return followers.map(f => ({
            id: f.follower.id,
            name: f.follower.name,
            userName: f.follower.userName,
            imageUrl: f.follower.imageUrl,
        }));
    }
    
    async getFollowing(userId: string) {
        const following = await prisma.follow.findMany({
            where: {
                followerId: userId,
            },
            select: {
                following: {
                    select: {
                        id: true,
                        name: true,
                        userName: true,
                        imageUrl: true,
                    },
                },
            },
        });
    
        return following.map(f => ({
            id: f.following.id,
            name: f.following.name,
            userName: f.following.userName,
            imageUrl: f.following.imageUrl,
        }));
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