
import { ResourceNotFoundError } from "../erros/resource-not-found-error";
import { PostsRepositoryInterface } from "@/repositories/prisma/interfaces/post-repository-interface";

export class UpdatePostService {
    private postRepository: PostsRepositoryInterface;

    constructor(postRepository: PostsRepositoryInterface) {
        this.postRepository = postRepository;
    }

    async execute({
        postId,
        userId,
        caption,
        tags,
        location,
        image,
    }: {
        postId: string;
        userId: string;
        caption?: string;
        tags?: string;
        location?: string;
        image?: {
            url: string;
            imageName: string;
            key: string;
            typeImage: string;
        };
    }) {
        const post = await this.postRepository.findById(postId);

        if (!post) {
            throw new ResourceNotFoundError();
        }

        if (post.creatorId !== userId) {
            throw new Error("Unauthorized");
        }

        const data: any = {};
        if (caption) data.caption = caption;
        if (tags) data.tags = tags.split(",");
        if (location) data.location = location;
        if (image) {
            data.image = {
                deleteMany: {},
                create: {
                    url: image.url,
                    fileName: image.imageName,
                    key: image.key,
                    typeFile: image.typeImage,
                },
            };
        }

        await this.postRepository.update(postId, data);
    }

    async updateLikes({
        postId,
        userId,
        action,
    }: {
        postId: string;
        userId: string;
        action: 'add' | 'remove';
    }) {
        await this.postRepository.updateLikes(postId, userId, action);
    }

    async updateSaves({
        postId,
        userId,
        action,
    }: {
        postId: string;
        userId: string;
        action: 'add' | 'remove';
    }) {
        await this.postRepository.updateSaves(postId, userId, action);
    }
}
