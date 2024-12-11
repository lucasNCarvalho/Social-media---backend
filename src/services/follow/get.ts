
import { FollowRepositoryInterface } from "@/repositories/prisma/interfaces/follow-repository-interface";


interface getFollowUserServiceRequest {
    userId: string;
}

export class GetFollowService {
    private followRepository: FollowRepositoryInterface;

    constructor(followRepository: FollowRepositoryInterface) {
        this.followRepository = followRepository;
    }

    async getFollowersUser({ userId }: getFollowUserServiceRequest) {
        const users = await this.followRepository.getFollowers(userId)

        return users
    }


    async getFollowingUser({ userId }: getFollowUserServiceRequest) {
        const users = await this.followRepository.getFollowing(userId)

       return users
    }
}
