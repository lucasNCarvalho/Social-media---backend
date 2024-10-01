import { makeAuthenticateFactory } from "@/services/factories/make-authenticate-factory";
import { FastifyReply, FastifyRequest } from "fastify";
import { z } from "zod";


export async function revoke(request: FastifyRequest, reply: FastifyReply) {
    const registerBodySchema = z.object({
        userId: z.string()
    })

    const { userId } = registerBodySchema.parse(request.body)

    try {

        const authenticate = makeAuthenticateFactory()

        authenticate.revokeByUserId(userId)

    } catch (error) {
        return reply.status(403).send({ error: 'Invalid or expired refresh Token' })
    }


}