

import { makeGetMostLikedPostsFactory } from "@/services/factories/post/make-get-most-liked-post";
import { FastifyReply, FastifyRequest } from "fastify";


export async function getMostLikedPosts(request: FastifyRequest, reply: FastifyReply) {

    try {
        await request.jwtVerify();

        const getPostService = makeGetMostLikedPostsFactory()


        const posts = await getPostService.getMostLikedPostThisWeek()

        return reply.status(200).send(posts);
    } catch (error) {

        return reply.status(500).send({ message: "Erro interno do servidor" });
    }

}
