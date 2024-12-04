import { UsersRepositoryInterface } from "@/repositories/prisma/interfaces/users-repository-interface";
import { User } from "@prisma/client";
import { UserEmailAlreadyExistsError } from "../erros/userEmail-already-exists";
import { UserNameAlreadyExistsError } from "../erros/userUserName-already-exists";
import { hash } from "bcryptjs";
import { ResourceNotFoundError } from "../erros/resource-not-found-error";

interface UpdateUserServiceRequest {
    id: string;
    name?: string;
    userName?: string;
    password?: string;
}

export class UpdateUserService {
    private usersRepository: UsersRepositoryInterface;

    constructor(usersRepository: UsersRepositoryInterface) {
        this.usersRepository = usersRepository;
    }

    async execute({
        id,
        name,
        userName,
        password,
    }: UpdateUserServiceRequest) {

        const user = await this.usersRepository.findById(id);

        if (!user) {
            throw new ResourceNotFoundError();
        }


        if (userName && userName !== user.userName) {
            const userWithSameUserName = await this.usersRepository.findByUserName(userName);
            if (userWithSameUserName) {
                throw new UserNameAlreadyExistsError();
            }
        }


        let passwordHash: string | undefined;
        if (password) {
            passwordHash = await hash(password, 6);
        }


        await this.usersRepository.update(id, {
            name,
            userName,
            password_hash: passwordHash,
        });

    }
}
