

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


    constructor(userRepository: UsersRepositoryInterface) {
        this.userRepository = userRepository

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


  
}