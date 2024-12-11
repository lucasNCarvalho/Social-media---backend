
import { ResourceNotFoundError } from "@/services/erros/resource-not-found-error";
import { makeGetListLikesByPostFactory } from "@/services/factories/post/make-get-list-likes-post";
import { makeGetPostFactory } from "@/services/factories/post/make-get-post-factory";
import { FastifyReply, FastifyRequest } from "fastify";
import { z } from "zod";

export async function getListLikeByPost(request: FastifyRequest, reply: FastifyReply) {
    const postIdParamsSchema = z.object({
        postId: z.string()
    });


    try {
        await request.jwtVerify();

        const { postId } = postIdParamsSchema.parse(request.params);

        const getPostService = makeGetListLikesByPostFactory()


        const posts = await getPostService.getLikesByPostId({ postId })

        return reply.status(200).send(posts);
    } catch (error) {
        if (error instanceof z.ZodError) {
            return reply.status(400).send({ message: "Parâmetros inválidos", errors: error.errors });
        }

        return reply.status(500).send({ message: "Erro interno do servidor" });
    }

}
