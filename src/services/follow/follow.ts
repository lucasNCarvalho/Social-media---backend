
import { FollowRepositoryInterface } from "@/repositories/prisma/interfaces/follow-repository-interface";
import { AlreadyFollowingError } from "../erros/already-following-error";
import { NotFollowingError } from "../erros/not-following-error";

interface FollowUserServiceRequest {
    loggedUserId: string; 
    userId: string; 
    action: "follow" | "unfollow"; 
}

export class FollowUserService {
    private followRepository: FollowRepositoryInterface;

    constructor(followRepository: FollowRepositoryInterface) {
        this.followRepository = followRepository;
    }

    async execute({ loggedUserId, userId, action }: FollowUserServiceRequest): Promise<void> {
        if (loggedUserId === userId) {
            throw new Error("Você não pode seguir ou deixar de seguir a si mesmo.");
        }

        const isAlreadyFollowing = await this.followRepository.isFollowing(userId, loggedUserId);
  
        if (action === "follow") {
            if (isAlreadyFollowing) {
                throw new AlreadyFollowingError();
            }
            await this.followRepository.followUser(loggedUserId, userId);
        } else if (action === "unfollow") {
            if (!isAlreadyFollowing) {
                throw new NotFollowingError();
            }
            await this.followRepository.unfollowUser(loggedUserId, userId);
        }
    }
}
