
import { ResourceNotFoundError } from "../erros/resource-not-found-error";


export interface RegisterServiceRequest {
    pageTitle: string,
    section: string,
    identifier: string,
    files: {
        fileName: string,
        url: string,
        typeFile: string,
        key: number
    }[];
}

export class RegisterService {
    private imageRepository: FileRepositoryInterface
    private postRepository: PageRepositoryInterface

    constructor(fileRepository: FileRepositoryInterface, pageRepository: PageRepositoryInterface) {
        this.fileRepository = fileRepository
        this.pageRepository = pageRepository
    }

    async execute(newFile: RegisterServiceRequest) {

        const {pageTitle} = newFile
        
        const page = await this.pageRepository.findByTitle(pageTitle)

        if (!page) {
            throw new ResourceNotFoundError()
        }

        const data = {
            newFile,
            page: { connect: { id: page.id } },
        }

        this.fileRepository.insert(data)
    }

}