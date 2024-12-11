import { InvalidFileType } from "@/services/erros/invalid-file-type";
import { makeUploadFactory } from "@/services/factories/image/make-upload-factory";
import { makeUpdateUserFactory } from "@/services/factories/make-update-factory";

import { processParts } from "@/utils/processParts";
import { FastifyReply, FastifyRequest } from "fastify";
import { z } from "zod";

export async function updateUser(request: FastifyRequest, reply: FastifyReply) {
    await request.jwtVerify();

    const paramsSchema = z.object({
        userId: z.string().uuid(),
    });

    const updateUserSchema = z.object({
        name: z.string().optional(),
        userName: z.string().optional(),
        password: z.string().optional(),
        bio: z.string().optional(),
        image: z.object({
            data: z.instanceof(Buffer),
            name: z.string().min(1),
        }).optional(),
    });

    try {
        const fileUpload = makeUploadFactory()
        const updateUserService = makeUpdateUserFactory()
   
        const allowedFields = ["name", "userName", "password", "bio"]

        const { userId } = paramsSchema.parse(request.params);
   
        if (request.user.sub !== userId) {
            return reply.status(401).send({ error: "Acesso não autorizado. Você não tem permissão para atualizar este usuário." });
        }

        const parts = await processParts({ request, allowedFields });
     
        const { image, name, userName, password, bio } = updateUserSchema.parse(parts);
      
        let imageUrl: string | undefined;

        if (image) {
            const { url } = await fileUpload.execute(image);
            imageUrl = url;
        }

        await updateUserService.execute({
            id: userId,
            name,
            userName,
            password,
            imageUrl,
            bio
        });

        reply.status(200).send({ message: "Usuário atualizado com sucesso!" });
    } catch (error) {
        if (error instanceof Error && error.name === "ResourceNotFoundError") {
            return reply.status(404).send({ error: "Usuário não encontrado" });
        }

        if (error instanceof InvalidFileType) {
            return reply.status(400).send({ error: "Tipo de arquivo inválido" });
        }

        return reply.status(500).send({ error: "Falha inesperada ao atualizar usuário" });
    }
}
