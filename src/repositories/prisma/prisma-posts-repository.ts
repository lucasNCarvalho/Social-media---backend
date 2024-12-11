import { prisma } from "@/lib/prisma";
import { Prisma } from "@prisma/client";
import { PostsRepositoryInterface } from "./interfaces/post-repository-interface";

export class PrismaPostRepository implements PostsRepositoryInterface {
    async create(data: Prisma.PostCreateInput) {
        return await prisma.post.create({
            data,
        });
    }
    async getAll(userId: string, options?: { onlyOwnPosts?: boolean }) {
        const whereClause = options?.onlyOwnPosts
            ? { creatorId: userId }
            : {
                  OR: [
                      { creatorId: userId },
                      { creator: { following: { some: { followerId: userId } } } },
                  ],
              };
    
        const posts = await prisma.post.findMany({
            where: whereClause,
            orderBy: {
                created_at: "desc",
            },
            take: 20,
            include: {
                creator: {
                    select: {
                        id: true,
                        name: true,
                        userName: true,
                        imageUrl: true,
                    },
                },
                image: {
                    select: {
                        url: true,
                    },
                },
                likedPosts: {
                    take: 100,
                    orderBy: {
                        createdAt: "desc",
                    },
                    select: {
                        user: {
                            select: {
                                id: true,
                                name: true,
                                userName: true,
                                imageUrl: true,
                            },
                        },
                    },
                },
                saves: {
                    where: { userId },
                    select: {
                        userId: true,
                    },
                },
            },
        });
    
        return posts.map((post) => ({
            ...post,
            saves: post.saves.length > 0,
            likedPosts: post.likedPosts.map((like) => like.user),
        }));
    }
    
    async getSavedPosts(userId: string) {
        const savedPosts = await prisma.post.findMany({
            where: {
                saves: {
                    some: {
                        userId,
                    },
                },
            },
            orderBy: {
                created_at: "desc",
            },
            take: 20,
            include: {
                creator: {
                    select: {
                        id: true,
                        name: true,
                        userName: true,
                        imageUrl: true,
                    },
                },
                image: {
                    select: {
                        url: true,
                    },
                },
                likedPosts: {
                    take: 100,
                    orderBy: {
                        createdAt: "desc",
                    },
                    select: {
                        user: {
                            select: {
                                id: true,
                                name: true,
                                userName: true,
                                imageUrl: true,
                            },
                        },
                    },
                },
                saves: {
                    where: { userId },
                    select: {
                        userId: true,
                    },
                },
            },
        });
    
        return savedPosts.map((post) => ({
            ...post,
            saves: post.saves.length > 0,
            likedPosts: post.likedPosts.map((like) => like.user),
        }));
    }
    
    async getMostLikedPostsThisWeek() {
        const oneWeekAgo = new Date();
        oneWeekAgo.setDate(oneWeekAgo.getDate() - 7); 
    
        const posts = await prisma.post.findMany({
            where: {
                created_at: {
                    gte: oneWeekAgo, 
                },
            },
            orderBy: [
                { likedPosts: { _count: "desc" } }, 
                { created_at: "desc" }, 
            ],
            take: 20, 
            include: {
                creator: {
                    select: {
                        id: true,
                        name: true,
                        userName: true,
                        imageUrl: true,
                    },
                },
                image: {
                    select: {
                        url: true,
                    },
                },
                likedPosts: {
                    take: 100,
                    orderBy: {
                        createdAt: "desc",
                    },
                    select: {
                        user: {
                            select: {
                                id: true,
                                name: true,
                                userName: true,
                                imageUrl: true,
                            },
                        },
                    },
                },
                saves: {
                    select: {
                        userId: true,
                    },
                },
            },
        });
    
        return posts.map((post) => ({
            ...post,
            saves: post.saves.length > 0,
            likedPosts: post.likedPosts.map((like) => like.user),
        }));
    }
    
    
    async getLikesByPostId(postId: string) {
        const likes = await prisma.like.findMany({
            where: {
                postId,
            },
            select: {
                user: {
                    select: {
                        id: true,
                        name: true,
                        imageUrl: true,
                    },
                },
            },
        });
    
        return likes.map((like) => like.user);
    }

    async findByTag(tag: string) {
        const postIds = await prisma.$queryRaw<{ id: string }[]>`
            SELECT "id" 
            FROM "posts"
            WHERE array_to_string("tags", ',') ILIKE ${'%' + tag + '%'}
        `;
    
        if (postIds.length === 0) {
            return [];
        }
    
        return prisma.post.findMany({
            where: {
                id: {
                    in: postIds.map((p) => p.id),
                },
            },
            include: {
                creator: {
                    select: {
                        id: true,
                        name: true,
                        userName: true,
                        imageUrl: true,
                    },
                },
                image: {
                    select: {
                        url: true,
                    },
                },
                likedPosts: {
                    select: {
                        user: {
                            select: {
                                id: true,
                                name: true,
                                userName: true,
                                imageUrl: true,
                            },
                        },
                    },
                },
            },
        });
    }
    
       

    async findById(postId: string, userId?: string) {
        const post = await prisma.post.findUnique({
            where: {
                id: postId,
            },
            include: {
                creator: {
                    select: {
                        id: true,
                        name: true,
                        userName: true,
                        imageUrl: true,
                    },
                },
                image: {
                    select: {
                        url: true,
                    },
                },
                likedPosts: {
                    take: 100, 
                    orderBy: {
                        createdAt: "desc", 
                    },
                    select: {
                        user: {
                            select: {
                                id: true,
                                name: true,
                                userName: true,
                                imageUrl: true,
                            },
                        },
                    },
                },
                saves: {
                    where: { userId },
                    select: {
                        userId: true,
                    },
                },
            },
        });
    
        if (!post) {
            return null;
        }
    
        return {
            ...post,
            saves: post.saves.length > 0,
            likedPosts: post.likedPosts.map((like) => like.user), 
        };
    }
    

    async update(id: string, data: Prisma.PostUpdateInput) {
        await prisma.post.update({
            where: {
                id
            },
            data
        })
    }



    async updateLikes(postId: string, userId: string, action: 'add' | 'remove') {

        if (action === 'add') {

            await prisma.like.create({
                data: {
                    userId,
                    postId,
                },
            });
        } else if (action === 'remove') {

            await prisma.like.deleteMany({
                where: {
                    userId,
                    postId,
                },
            });
        }
    }



    async updateSaves(postId: string, userId: string, action: 'add' | 'remove') {
        if (action === 'add') {
            await prisma.save.create({
                data: {
                    userId,
                    postId,
                },
            });
        } else {
            await prisma.save.deleteMany({
                where: {
                    userId,
                    postId,
                },
            });
        }
    }

    

    async delete(postId: string) {
        await prisma.post.delete({
            where: {
                id: postId
            }
        })
    }

}
