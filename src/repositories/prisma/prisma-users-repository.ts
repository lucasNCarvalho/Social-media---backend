import { Prisma, User} from "@prisma/client";
import { prisma } from "@/lib/prisma";
import { UsersRepositoryInterface } from "./interfaces/users-repository-interface";

export class PrismaUserRepository implements UsersRepositoryInterface {

    async create(data: Prisma.UserCreateInput) {
        return await prisma.user.create({
            data,
        })
    }

    async findByEmail(email: string) {

       return await prisma.user.findUnique({
            where: {
                email,
            }
        })
    }
    
    async findById(userId: string) {
        return await prisma.user.findUnique({
            where: {
                id: userId,
            }
        })
    }
    
    async findByUserName(userName: string) {
        return await prisma.user.findUnique({
            where: {
                userName
            }
        });
    }
    
    
    
}