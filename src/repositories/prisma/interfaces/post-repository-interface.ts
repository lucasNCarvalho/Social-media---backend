import { Prisma, Post } from "@prisma/client";

export interface PostsRepositoryInterface {
    create(data: Prisma.PostCreateInput): Promise<Post>;
    getAll(userId: string, options?: { onlyOwnPosts?: boolean }): Promise<Post[]>
    getSavedPosts(userId: string): Promise<Post[]>
    findById(postId: string, userId?: string): Promise<Post | null>
    update(id: string, data: Prisma.PostUpdateInput): Promise<void>
    updateLikes(postId: string, userId: string, action: 'add' | 'remove'): Promise<void>;
    updateSaves(postId: string, userId: string, action: 'add' | 'remove'): Promise<void>;
    delete(postId: string): Promise<void>
}