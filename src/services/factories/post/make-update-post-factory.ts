import { PrismaPostRepository } from "@/repositories/prisma/prisma-posts-repository";
import { UpdatePostService } from "@/services/post/update";


export function makeUpdatePostFactory() {
    const postRepository = new PrismaPostRepository();
    const updatePostService = new UpdatePostService(postRepository);

    return updatePostService;
}