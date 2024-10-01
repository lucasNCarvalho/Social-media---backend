import { RefreshToken} from "@prisma/client";

export interface RefreshTokenRepositoryInterface {
    create({refreshToken, userId}: {refreshToken: string; userId: string}): Promise<void>
    revokeByUserId(userId: string): Promise<void>
    revokeByRefreshToken(refreshToken: string): Promise<void>
    getToken(refreshToken: string): Promise<RefreshToken | null>
    
}