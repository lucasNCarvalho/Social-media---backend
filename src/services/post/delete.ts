import { ResourceNotFoundError } from "../erros/resource-not-found-error";
import { PostsRepositoryInterface } from "@/repositories/prisma/interfaces/post-repository-interface";


interface DeletePostServiceRequest {
    postId: string
    userId: string
}


export class DeletePostService {
    private postRepository: PostsRepositoryInterface;

    constructor(postRepository: PostsRepositoryInterface) {
        this.postRepository = postRepository;
    }

    async execute({postId, userId }: DeletePostServiceRequest ) {
        const post = await this.postRepository.findById(postId)

        if(post?.creatorId !== userId) {
            throw new Error("Unauthorized");
        }

        if(!post) {
            throw new ResourceNotFoundError()
        }

         await this.postRepository.delete(postId)

    }


}
