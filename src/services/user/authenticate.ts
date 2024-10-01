
import { RefreshTokenRepositoryInterface } from "@/repositories/prisma/interfaces/refreshToken-repository-interface";
import { UsersRepositoryInterface } from "@/repositories/prisma/interfaces/users-repository-interface";
import { User } from "@prisma/client";

import { compare } from "bcryptjs";
import { InvalidCredentialsError } from "../erros/invalid-credentials-error";


interface AuthenticateServiceRequest {
    email: string
    password: string
}

interface AuthenticateServiceRespone {
    user: User
}

export class AuthenticateService {
    private userRepository: UsersRepositoryInterface
    private refreshTokenRepository: RefreshTokenRepositoryInterface

    constructor(userRepository: UsersRepositoryInterface, refreshTokenRepository: RefreshTokenRepositoryInterface) {
        this.userRepository = userRepository
        this.refreshTokenRepository = refreshTokenRepository
    }

    async execute({email, password}: AuthenticateServiceRequest): Promise<AuthenticateServiceRespone> {
        const user = await this.userRepository.findByEmail(email)
 
        if(!user) {
            throw new InvalidCredentialsError()
        }

        const doesPasswordMatches = await compare(password, user.password_hash)

        if(!doesPasswordMatches) {
            throw new InvalidCredentialsError()
        }

        return {user} 
    }


    async saveRefreshToken({refreshToken, userId}: {refreshToken: string; userId: string}) {
        await this.refreshTokenRepository.create({refreshToken, userId})
    }

    async revokeByUserId(userId: string) {
        await this.refreshTokenRepository.revokeByUserId(userId)
    }

    async revokeByRefreshToken(refreshToken: string) {
        await this.refreshTokenRepository.revokeByRefreshToken(refreshToken)
    }


    async getToken(refreshToken: string) {
      const storedToken =  await this.refreshTokenRepository.getToken(refreshToken)

      return storedToken
    }
}