import { PrismaPostRepository } from "@/repositories/prisma/prisma-posts-repository"
import { PrismaUserRepository } from "@/repositories/prisma/prisma-users-repository"
import { CreatePostService } from "@/services/post/create"



export function makeCreatePostFactory() {
    const postRepository = new PrismaPostRepository()
    const userRepository = new PrismaUserRepository()
    return new CreatePostService(postRepository, userRepository)
}