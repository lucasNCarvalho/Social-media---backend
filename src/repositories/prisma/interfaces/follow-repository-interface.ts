interface user {
    id: string;
    name: string;
    userName: string;
    imageUrl: string | null;
}

export interface FollowRepositoryInterface {
    getFollowersCount(userId: string): Promise<number>;
    getFollowingCount(userId: string): Promise<number>;
    isFollowing(userId: string, loggedUserId: string): Promise<boolean>;
    followUser(userId: string, loggedUserId: string): Promise<void>;
    unfollowUser(userId: string, loggedUserId: string): Promise<void>;
    getFollowers(userId: string): Promise<Array<user>>;
    getFollowing(userId: string): Promise<Array<user>>;
}
