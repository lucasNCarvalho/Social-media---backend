
export interface ImageRepositoryInterface {
    upload(file: Buffer, fileName: string, typeFile: string): Promise<void>
}