import { FollowRepositoryInterface } from "@/repositories/prisma/interfaces/follow-repository-interface";

export class CheckFollowService {
    private followRepository: FollowRepositoryInterface;

    constructor(followRepository: FollowRepositoryInterface) {
        this.followRepository = followRepository;
    }

    async execute(loggedUserId: string, userId: string): Promise<{ isFollowing: boolean }> {
        const isFollowing = await this.followRepository.isFollowing(userId, loggedUserId);
        return { isFollowing };
    }
}
