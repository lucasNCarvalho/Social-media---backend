import { prisma } from "@/lib/prisma";
import { Prisma } from "@prisma/client";

export class PrismaPostRepository {

    async create(data: Prisma.PostCreateInput) {
        return await prisma.post.create({
            data,
        })
    }

}