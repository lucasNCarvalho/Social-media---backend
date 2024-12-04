
import { ResourceNotFoundError } from "@/services/erros/resource-not-found-error";
import { makeDeletePostFactory } from "@/services/factories/post/make-delete-post-factory";

import { FastifyReply, FastifyRequest } from "fastify";
import { z } from "zod";

export async function deletePost(request: FastifyRequest, reply: FastifyReply) {
    const postIdParamsSchema = z.object({
        postId: z.string()
    });


    try {
        await request.jwtVerify();

        const { postId } = postIdParamsSchema.parse(request.params);

        const deletePostService = makeDeletePostFactory();

         await deletePostService.execute({
            postId,
            userId: request.user.sub
        });

        return reply.status(200).send({message: "Post excluído com sucesso"});
    } catch (error: any) {
        if (error instanceof z.ZodError) {
            return reply.status(400).send({ message: "Parâmetros inválidos", errors: error.errors });
        }

        if (error instanceof ResourceNotFoundError) {
            return reply.status(404).send({ message: "Post não encontrado" });
        }

        if (error.message === "Unauthorized") {
            return reply.status(409).send({ error: "Não autorizado" });
        }


        console.error("Erro interno:", error);
        return reply.status(500).send({ message: "Erro interno do servidor" });
    }
}
