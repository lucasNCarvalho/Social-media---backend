
import { User } from "@prisma/client";
import { ResourceNotFoundError } from "../erros/resource-not-found-error";
import { UsersRepositoryInterface } from "@/repositories/prisma/interfaces/users-repository-interface";


interface GetUserProfileServiceRequest {
    userId: string
}

interface GetUserProfileServiceResponse {
    user: User
}

export class GetUserProfileService{
    private userRepository: UsersRepositoryInterface

    constructor(userRepository: UsersRepositoryInterface) {
        this.userRepository = userRepository
    }

    async execute({userId}: GetUserProfileServiceRequest): Promise<GetUserProfileServiceResponse>{
        const user = await this.userRepository.findById(userId) 

        if(!user) {
            throw new ResourceNotFoundError()
        }

        return {
            user
        }
    }
}