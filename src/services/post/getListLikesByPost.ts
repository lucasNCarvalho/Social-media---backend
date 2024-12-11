import { PostsRepositoryInterface } from "@/repositories/prisma/interfaces/post-repository-interface";


interface getListeByPostRequest  {
    postId: string;
}

type  getLikesByPostIdResponse = {
   id: string; 
   name: string; 
   imageUrl: string | null 
}[]



export class GetListLikesByPostService {
    private postRepository: PostsRepositoryInterface;

    constructor(postRepository: PostsRepositoryInterface) {
        this.postRepository = postRepository;
    }


    async getLikesByPostId({postId}: getListeByPostRequest): Promise<getLikesByPostIdResponse> {
        const likes = await this.postRepository.getLikesByPostId(postId);

       return likes
    }
}
