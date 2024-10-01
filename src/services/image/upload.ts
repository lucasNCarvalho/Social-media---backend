
import { Readable } from "stream";
import detect from 'magic-bytes.js';

import { randomUUID } from "crypto";
import { InvalidFileType } from "@/repositories/prisma/interfaces/invalid-file-type";
import { FileRepositoryInterface } from "@/repositories/cloudflare/interfaces/file-repository-interface";


export interface UploadServiceRequest {
    file: Buffer,
    name: string
}

export interface UploadServiceResponse {
    fileName: string,
    url: string,
    typeFile: string,
    key: string
}

export class UploadService {
    private fileRepository: FileRepositoryInterface

    constructor(fileRepository: FileRepositoryInterface) {
        this.fileRepository = fileRepository
    }

    async upload(files: UploadServiceRequest[]): Promise<UploadServiceResponse[]> {
        const uploadedFiles:UploadServiceResponse[] = []
  
        await Promise.all(files.map(async (data, index) => {
            const baseUrl: string = 'https://pub-de25045fb0ec4544b76b2924a3cdf2dd.r2.dev';

            const typeFile = await this.getTypeFile(data.file);

            if (!typeFile || !this.isValidFileType(typeFile)) {
                throw new InvalidFileType()
            }

            const fileName = randomUUID()

            await this.fileRepository.upload(data.file, fileName, typeFile)

            const fileUrl = baseUrl.concat(`/${fileName}`)

            uploadedFiles[index] = {
                fileName: data.name, 
                url: fileUrl,     
                typeFile,         
                key: fileName      
            };

        
        }))
        return uploadedFiles
    }

    isValidFileType(type: string) {
        const allowedTypes = ['image/png', 'image/jpeg', 'application/pdf']; // svg, webp, mais tipos de imagens
        return allowedTypes.includes(type);
    }

    async getTypeFile(file: Buffer) {
        const detectedType = detect(file);
        return detectedType.length > 0 ? detectedType[0].mime : null;
    }

    async streamToBuffer(stream: Readable): Promise<Buffer> {
        return new Promise((resolve, reject) => {
            const chunks: Buffer[] = [];
            stream.on('data', chunk => chunks.push(chunk));
            stream.on('end', () => resolve(Buffer.concat(chunks)));
            stream.on('error', reject);
        });
    }
}