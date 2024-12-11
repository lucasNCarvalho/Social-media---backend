import { Prisma, User } from "@prisma/client";

export interface UsersRepositoryInterface {
    create(data: Prisma.UserCreateInput): Promise<User>
    findByEmail(email: string): Promise<User | null>
    findById(userId: string): Promise<User | null>
    findByUserName(userName: string): Promise<User | null>
    update(id: string, data: Prisma.UserUpdateInput): Promise<void>
    findByName(name: string): Promise<User[] | []>
}