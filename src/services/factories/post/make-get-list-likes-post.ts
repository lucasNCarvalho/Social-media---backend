import { PrismaPostRepository } from "@/repositories/prisma/prisma-posts-repository"
import { GetListLikesByPostService } from "@/services/post/getListLikesByPost"


export function makeGetListLikesByPostFactory() {
    const postRepository = new PrismaPostRepository()
    return new GetListLikesByPostService(postRepository)
}