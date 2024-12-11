import { Post } from "@prisma/client";
import { ResourceNotFoundError } from "../erros/resource-not-found-error";
import { PostsRepositoryInterface } from "@/repositories/prisma/interfaces/post-repository-interface";


interface GetAllPostServiceRequest {
    userId: string;
    onlyOwnPosts?: boolean
}

type PostServiceResponse = {
    posts?: Post[];

};

type getAllPostSavedByUserIdRequest = {
    userId: string
}

interface GetAPostByIdServiceRequest {
    postId: string;
    userId?: string;
}

type GetPostServiceResponse = {
    post?: Post;
};

interface GetPostsByTagServiceRequest {
    tag: string;
}



export class GetPostService {
    private postRepository: PostsRepositoryInterface;

    constructor(postRepository: PostsRepositoryInterface) {
        this.postRepository = postRepository;
    }

    async getAll({ userId, onlyOwnPosts }: GetAllPostServiceRequest): Promise<PostServiceResponse> {

        const posts = await this.postRepository.getAll(userId, { onlyOwnPosts });

        return { posts };
    }

    async getById({ postId, userId }: GetAPostByIdServiceRequest): Promise<GetPostServiceResponse> {
        let post

        if (postId) {
            post = await this.postRepository.findById(postId);
        }

        if (!post) {
            throw new ResourceNotFoundError();
        }

        return { post };

    }

    async getSavedPosts({ userId }: getAllPostSavedByUserIdRequest): Promise<PostServiceResponse> {
        const posts = await this.postRepository.getSavedPosts(userId);

        return { posts };
    }

    async getByTag({ tag }: GetPostsByTagServiceRequest): Promise<PostServiceResponse> {
        const posts = await this.postRepository.findByTag(tag);

        return { posts };
    }

}
