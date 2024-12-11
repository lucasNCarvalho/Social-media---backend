import { PostsRepositoryInterface } from "@/repositories/prisma/interfaces/post-repository-interface";
import { Post } from "@prisma/client";



type GetMostLikedPostsResponse = Post[]


export class GetMostLikedPostsService {
    private postRepository: PostsRepositoryInterface;

    constructor(postRepository: PostsRepositoryInterface) {
        this.postRepository = postRepository;
    }


    async getMostLikedPostThisWeek(): Promise<GetMostLikedPostsResponse> {
        const posts = await this.postRepository.getMostLikedPostsThisWeek();

        return posts
    }
}
