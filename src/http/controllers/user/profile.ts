
import { makeGetUserProfileService } from "@/services/factories/make-get-user-profile-service";
import { FastifyReply, FastifyRequest } from "fastify";
import { z } from "zod";

export async function profile(request: FastifyRequest, reply: FastifyReply) {
    const userIdParamsSchema = z.object({
        userId: z.string().optional()
    })

    try {
        await request.jwtVerify()
        const { userId } = userIdParamsSchema.parse(request.params)



        const getUserProfile = makeGetUserProfileService()

        const { user } = await getUserProfile.execute({
            loggedUserId: request.user.sub,
            userId,
        })

        return reply.status(200).send(user)
    } catch (error) {
        reply.status(500).send({message: 'Erro interno'})
    }

}