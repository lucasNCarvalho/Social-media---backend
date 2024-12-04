import { CloudflareImageRepository } from "@/repositories/cloudflare/cloudflare-image-repository"
import { UploadService } from "@/services/image/upload"


export function makeUploadFactory() {
    const prismaFileRepository = new CloudflareImageRepository()
    const fileService = new UploadService(prismaFileRepository)

    return fileService
}