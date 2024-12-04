
import { Readable } from "stream";
import detect from 'magic-bytes.js';

import { randomUUID } from "crypto";

import { ImageRepositoryInterface } from "@/repositories/cloudflare/interfaces/image-repository-interface";
import { InvalidFileType } from "../erros/invalid-file-type";


export interface UploadServiceRequest {
    data: Buffer,
    name: string
}

export interface UploadServiceResponse {
    imageName: string,
    url: string,
    typeImage: string,
    key: number
}

export class UploadService {
    private imageRepository: ImageRepositoryInterface

    constructor(imageRepository: ImageRepositoryInterface) {
        this.imageRepository = imageRepository
    }

    async execute(image: UploadServiceRequest) {
        try {

            const baseUrl: string = 'https://pub-822da8d957fb44e9a99e79bda8595410.r2.dev';

            const typeImage = await this.getTypeImage(image.data);

            if (!typeImage || !this.isValidImageType(typeImage)) {
                throw new InvalidFileType()
            }

            const fileName = randomUUID()

            await this.imageRepository.upload(image.data, fileName, typeImage)

            const imageUrl = baseUrl.concat(`/${fileName}`)

            const uploadedFile = {
                imageName: image.name,
                url: imageUrl,
                typeImage: typeImage,
                key: fileName
            }

            return uploadedFile
        } catch (error) {
            throw new Error('Failed to upload')
        }
    }

    isValidImageType(type: string) {
        const allowedTypes = ['image/png', 'image/jpeg',]; 
        return allowedTypes.includes(type);
    }

    async getTypeImage(image: Buffer) {
        const detectedType = detect(image);
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