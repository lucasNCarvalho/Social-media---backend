import { prisma } from "@/lib/prisma";
import { ImageRepositoryInterface } from "./interfaces/image-repository-interface";



export class PrismaImageRepository implements ImageRepositoryInterface  {
    insert(data: PrismaFileRepositoryType) {
        throw new Error("Method not implemented.");
    }

}