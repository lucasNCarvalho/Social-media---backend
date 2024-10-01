
import { Image } from "@prisma/client"


export type PrismaImageRepositoryType = {
    newFile: RegisterServiceRequest,
    post: {connect : {id: string}},
}

export interface ImageRepositoryInterface {
    insert(data: PrismaFileRepositoryType): Promise<void>
}