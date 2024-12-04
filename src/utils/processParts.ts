import { makeUploadFactory } from "@/services/factories/image/make-upload-factory";
import { FastifyRequest } from "fastify";

interface processPartsProps {
    request: FastifyRequest;
    allowedFields: string[];
}

export async function processParts({ request, allowedFields }: processPartsProps) {
    const fields: { [key: string]: string } = {};
    let image: { data: Buffer; name: string } | null = null;

    for await (const part of request.parts()) {
        if (part.type === 'file' && part.fieldname === 'image') {
            const fileUpload = makeUploadFactory();
            const fileBuffer = await fileUpload.streamToBuffer(part.file);

            image = {
                data: fileBuffer,
                name: part.filename,
            };
        } else if (part.type === 'field' && allowedFields.includes(part.fieldname)) {
            fields[part.fieldname] = part.value as string;
        }
    }

    return {
        ...fields,
        image, 
    };
}
