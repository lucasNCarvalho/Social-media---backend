
import { User } from "@prisma/client";
import {hash} from 'bcryptjs'
import { UsersRepositoryInterface } from "@/repositories/prisma/interfaces/users-repository-interface";
import { UserEmailAlreadyExistsError } from "../erros/userEmail-already-exists";
import { UserNameAlreadyExistsError } from "../erros/userUserName-already-exists";


interface RegisterUserServiceRequest {
    name: string;
    userName: string,
    email: string;
    password: string
}

interface RegisterUserServiceResponse {
    user: User
}

export class RegisterUserService {
    private UsersRepository: UsersRepositoryInterface

    constructor(userRepository: UsersRepositoryInterface) {
        this.UsersRepository = userRepository
    }

    async execute({email , name ,userName, password}: RegisterUserServiceRequest): Promise<RegisterUserServiceResponse> {
        const password_hash = await hash(password, 6)

        const userWithSameEmail = await this.UsersRepository.findByEmail(email)

        if(userWithSameEmail) {
            throw new UserEmailAlreadyExistsError()
        }

        const userWithSameUserName = await this.UsersRepository.findByUserName(userName)

        if(userWithSameUserName) {
            throw new UserNameAlreadyExistsError()
        }

        const user = await this.UsersRepository.create({
            name,
            userName,
            email,
            password_hash
        })

        return {
            user,
        }
    }
}