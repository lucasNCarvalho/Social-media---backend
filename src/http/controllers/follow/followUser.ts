// follow-controller.ts

import { AlreadyFollowingError } from "@/services/erros/already-following-error";
import { NotFollowingError } from "@/services/erros/not-following-error";
import { makeFollowUserFactory } from "@/services/factories/follow/make-follow-user-factory";
import { FastifyReply, FastifyRequest } from "fastify";
import { z } from "zod";

export async function followUser(request: FastifyRequest, reply: FastifyReply) {
    const followParamsSchema = z.object({
        userId: z.string().uuid(),
        action: z.enum(["follow", "unfollow"]),
    });

    try {
        await request.jwtVerify();

        const { userId, action } = followParamsSchema.parse(request.body);
        const loggedUserId = request.user.sub;

        const followUserService = makeFollowUserFactory();

        await followUserService.execute({ loggedUserId, userId, action });

        const message =
            action === "follow" ? "Agora você está seguindo este usuário." : "Você deixou de seguir este usuário.";
        return reply.status(200).send({ message });
    } catch (error) {
        if (error instanceof z.ZodError) {
            return reply.status(400).send({ message: "Parâmetros inválidos", errors: error.errors });
        }

        if (error instanceof AlreadyFollowingError) {
            return reply.status(409).send({ message: error.message }); 
        }

        if (error instanceof NotFollowingError) {
            return reply.status(404).send({ message: error.message }); 
        }

        return reply.status(500).send({ message: "Erro interno do servidor" });
    }
}
