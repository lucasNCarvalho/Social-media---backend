
import { env } from "@/env";
import { PrismaClient } from "@prisma/client";


export const prisma = new PrismaClient({
    // log: env.NODE_ENV === 'dev' ? ['query'] : [], 
})

//A configuração acima do Prisma, faz com que seja exibido um log das querys enseridas no banco, todo o código SQL executado, apenas em ambiente de dev