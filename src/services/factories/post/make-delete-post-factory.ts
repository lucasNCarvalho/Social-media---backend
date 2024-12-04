import { PrismaPostRepository } from "@/repositories/prisma/prisma-posts-repository"
import { DeletePostService } from "@/services/post/delete"


export function makeDeletePostFactory() {
    const postRepository = new PrismaPostRepository()
    return new DeletePostService(postRepository)
}