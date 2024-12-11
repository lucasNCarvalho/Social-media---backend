import { makeGetFollowFactory } from "@/services/factories/follow/make-get-follow-factory";
import { FastifyReply, FastifyRequest } from "fastify";
import { z } from "zod";


export async function getUserFollowers(request: FastifyRequest, reply: FastifyReply) {
    const followersParamsSchema = z.object({
        userId: z.string(),
    });

    try {
        await request.jwtVerify();
     
        const { userId } = followersParamsSchema.parse(request.params);

        const followService =  makeGetFollowFactory(); 
        const followers = await followService.getFollowersUser({userId});

        return reply.status(200).send(followers);
    } catch (error) {
        return reply.status(500).send({ message: "Erro interno" });
    }
}
