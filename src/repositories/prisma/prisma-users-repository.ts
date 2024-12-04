import { Prisma} from "@prisma/client";
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

  
        const user = await prisma.user.findUnique({
            where: {
                id: userId,
            },
            include: {
                _count: {
                    select: {
                        posts: true,
                    },
                },
            },
        });
    
        if (!user) {
            return null;
        }

       
        const { _count, ...userWithoutCount } = user;
    
        return {
            ...userWithoutCount,
            postsCount: _count.posts,
        };
    }
    
    
    async findByUserName(userName: string) {
        return await prisma.user.findUnique({
            where: {
                userName
            }
        });
    }

    async update(id: string, data: Prisma.UserUpdateInput) {
        await prisma.user.update({
            where: {
                id,
            },
            data
        })
    }
        
}