import { ResourceNotFoundError } from "@/services/erros/resource-not-found-error";
import { makeGetPostFactory } from "@/services/factories/post/make-get-post-factory";
import { FastifyReply, FastifyRequest } from "fastify";
import { z } from "zod";

export async function getPost(request: FastifyRequest, reply: FastifyReply) {
    const postIdParamsSchema = z.object({
        postId: z.string().optional(),
    });

    const postQueryParamsSchema = z.object({
        onlyOwnPosts: z
            .union([z.string(), z.boolean()])
            .optional()
            .transform((val) => val === "true" || val === true)
            .default(false),
        userId: z.string().uuid().optional(),
        savedPosts: z
            .union([z.string(), z.boolean()])
            .optional()
            .transform((val) => val === "true" || val === true)
            .default(false),
        tag: z.string().optional(), 
    }).refine((data) => {
        return (
            (data.onlyOwnPosts && data.userId) ||
            (!data.onlyOwnPosts && !data.userId) ||
            data.savedPosts
        );
    }, {
        message: "Os parâmetros 'onlyOwnPosts' e 'userId' devem ser enviados juntos ou nenhum.",
        path: ["onlyOwnPosts", "userId"],
    });

    try {
        await request.jwtVerify();

        const { postId } = postIdParamsSchema.parse(request.params);
        const { onlyOwnPosts, userId, savedPosts, tag } = postQueryParamsSchema.parse(request.query);

        const getPostService = makeGetPostFactory();

        if (postId) {
            const { post } = await getPostService.getById({
                postId,
                userId: request.user.sub,
            });

            return reply.status(200).send(post);
        }

        const queryUserId = userId || request.user.sub;

        if (savedPosts) {
            const { posts } = await getPostService.getSavedPosts({ userId: queryUserId });
            return reply.status(200).send(posts);
        }

        if (tag) {
            const { posts } = await getPostService.getByTag({ tag }); 
            return reply.status(200).send(posts);
        }

        const { posts } = await getPostService.getAll({
            userId: queryUserId,
            onlyOwnPosts,
        });

        return reply.status(200).send(posts);
    } catch (error) {
        if (error instanceof z.ZodError) {
            return reply.status(400).send({ message: "Parâmetros inválidos", errors: error.errors });
        }

        if (error instanceof ResourceNotFoundError) {
            return reply.status(404).send({ message: "Post não encontrado" });
        }

        console.error("Erro interno:", error);
        return reply.status(500).send({ message: "Erro interno do servidor" });
    }
}
