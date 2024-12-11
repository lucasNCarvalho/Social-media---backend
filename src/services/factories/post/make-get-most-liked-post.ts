import { PrismaPostRepository } from "@/repositories/prisma/prisma-posts-repository"
import { GetMostLikedPostsService } from "@/services/post/getMostLikedPosts"


export function makeGetMostLikedPostsFactory() {
    const postRepository = new PrismaPostRepository()
    return new GetMostLikedPostsService(postRepository)
}