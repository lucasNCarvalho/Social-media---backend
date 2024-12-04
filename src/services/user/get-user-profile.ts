import { Follow, User } from "@prisma/client";
import { ResourceNotFoundError } from "../erros/resource-not-found-error";
import { UsersRepositoryInterface } from "@/repositories/prisma/interfaces/users-repository-interface";
import { FollowRepositoryInterface } from "@/repositories/prisma/interfaces/follow-repository-interface";

interface GetUserProfileServiceRequest {
    loggedUserId: string;
    userId?: string;
}

type GetUserProfileServiceResponse = {
    user: (Partial<User> & { followersCount: number; followingCount: number }) | null;
};

export class GetUserProfileService {
    private userRepository: UsersRepositoryInterface;
    private followRepository: FollowRepositoryInterface;

    constructor(userRepository: UsersRepositoryInterface, followRepository: FollowRepositoryInterface) {
        this.userRepository = userRepository;
        this.followRepository = followRepository;
    }

    async execute({ loggedUserId, userId }: GetUserProfileServiceRequest): Promise<GetUserProfileServiceResponse> {
        let user: User | null;

        if (userId) {

            user = await this.userRepository.findById(userId);
            if (!user) {
                throw new ResourceNotFoundError();
            }

            const followersCount = await this.followRepository.getFollowersCount(userId);
            const followingCount = await this.followRepository.getFollowingCount(userId);

            const { email, created_at, password_hash, ...safeUser } = user;
            return {
                user: {
                    ...safeUser,
                    followersCount,
                    followingCount
                }
            };
        }

        user = await this.userRepository.findById(loggedUserId);

        const followersCount = await this.followRepository.getFollowersCount(loggedUserId);
        const followingCount = await this.followRepository.getFollowingCount(loggedUserId);

        if (!user) {
            throw new ResourceNotFoundError();
        }

        const { password_hash, ...safeUser } = user;
        return {
            user: {
                ...safeUser,
                followersCount,
                followingCount
            }
        };
    }
}
