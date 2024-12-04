import { PrismaPostRepository } from "@/repositories/prisma/prisma-posts-repository"
import { GetPostService } from "@/services/post/get"

export function makeGetPostFactory() {
    const postRepository = new PrismaPostRepository()
    return new GetPostService(postRepository)
}