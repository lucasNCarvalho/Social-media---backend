import { ResourceNotFoundError } from "@/services/erros/resource-not-found-error";
import { makeUploadFactory } from "@/services/factories/image/make-upload-factory";
import { makeUpdatePostFactory } from "@/services/factories/post/make-update-post-factory";
import { processParts } from "@/utils/processParts";
import { FastifyReply, FastifyRequest } from "fastify";
import { z } from "zod";
export async function updatePost(request: FastifyRequest, reply: FastifyReply) {
    const updateBodySchema = z.object({
        caption: z.string().min(1).optional(),
        tags: z.string().min(1).optional(),
        location: z.string().min(1).optional(),
        image: z
        .object({
            data: z.instanceof(Buffer),
            name: z.string().min(1),
        })
        .optional()
        .nullable(), 
        like: z
        .union([z.boolean(), z.string()])
        .optional()
        .transform((val) => (val === undefined ? undefined : val === "true" || val === true)),
    save: z
        .union([z.boolean(), z.string()])
        .optional()
        .transform((val) => (val === undefined ? undefined : val === "true" || val === true)),
    });

    const paramsSchema = z.object({
        postId: z.string().uuid(),
    });

    const allowedFields = ['caption', 'location', 'tags', 'like', 'save'] ;

    try {
        await request.jwtVerify(); 

        const { postId } = paramsSchema.parse(request.params);

        const parts = await processParts({ request, allowedFields });

        const parsedData = updateBodySchema.parse(parts);

        const updatePostService = makeUpdatePostFactory();

       
        if (parsedData.like !== undefined) {
            console.log("a",parsedData)
            await updatePostService.updateLikes({
                postId,
                userId: request.user.sub,
                action: parsedData.like ? 'add' : 'remove',
            });
        }

        if (parsedData.save !== undefined) {
            console.log("a",parsedData)
            await updatePostService.updateSaves({
                postId,
                userId: request.user.sub,
                action: parsedData.save ? 'add' : 'remove',
            });
        }


        if (parsedData.caption || parsedData.tags || parsedData.location || parsedData.image) {
            let uploadedImage;
            if (parsedData.image) {
                const imageUpload = makeUploadFactory();
                uploadedImage = await imageUpload.execute(parsedData.image);
            }

            await updatePostService.execute({
                postId,
                userId: request.user.sub,
                caption: parsedData.caption,
                tags: parsedData.tags,
                location: parsedData.location,
                image: uploadedImage,
            });
        }

        return reply.status(200).send();
    } catch (error: any) {
        console.error('Erro na atualização do post:', error);

        if (error instanceof z.ZodError) {
            return reply.status(400).send({ error: "Parâmetros inválidos", details: error.errors });
        }

        if (error instanceof ResourceNotFoundError) {
            return reply.status(404).send({ error: "Post não encontrado" });
        }

        if (error.message === "Unauthorized") {
            return reply.status(409).send({ error: "Não autorizado" });
        }

        return reply.status(500).send({ error: "Erro interno do servidor" });
    }
}
