import { makeGetFollowFactory } from "@/services/factories/follow/make-get-follow-factory";
import { FastifyReply, FastifyRequest } from "fastify";
import { z } from "zod";


export async function getUserFollowing(request: FastifyRequest, reply: FastifyReply) {
    const followingParamsSchema = z.object({
        userId: z.string(),
    });

    try {
        await request.jwtVerify();
        const { userId } = followingParamsSchema.parse(request.params);

        const followService =  makeGetFollowFactory(); 
        const following = await followService.getFollowingUser({userId});

        return reply.status(200).send(following);
    } catch (error) {
        return reply.status(500).send({ message: "Erro interno" });
    }
}
