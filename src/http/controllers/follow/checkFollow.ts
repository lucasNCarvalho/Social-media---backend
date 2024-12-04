
import { makeCheckFollowFactory } from "@/services/factories/follow/make-check-follow.-factory";
import { FastifyReply, FastifyRequest } from "fastify";
import { z } from "zod";

export async function checkFollow(request: FastifyRequest, reply: FastifyReply) {
    const followCheckSchema = z.object({
        userId: z.string().uuid(),
    });

    try {
        await request.jwtVerify();

        const { userId } = followCheckSchema.parse(request.params);
        const loggedUserId = request.user.sub;

        const checkFollowService = makeCheckFollowFactory();
        const { isFollowing } = await checkFollowService.execute(loggedUserId, userId);

        return reply.status(200).send({ isFollowing });
    } catch (error) {

        reply.status(500).send({ message: "Erro interno do servidor" });
    }
}
