
import { ResourceNotFoundError } from "@/services/erros/resource-not-found-error";
import { makeGetUserProfileService } from "@/services/factories/make-get-user-profile-service";
import { FastifyReply, FastifyRequest } from "fastify";
import { z } from "zod";

export async function profile(request: FastifyRequest, reply: FastifyReply) {
    const profileParamsSchema = z.object({
        userId: z.string().optional()
    })

    const profileQueryParamsSchema = z.object({
        name: z.string().optional()
    })

    try {
        await request.jwtVerify()
        const { userId } = profileParamsSchema.parse(request.params)

        const { name } = profileQueryParamsSchema.parse(request.query)


        const getUserProfile = makeGetUserProfileService()

        const { user } = await getUserProfile.execute({
            loggedUserId: request.user.sub,
            userId,
            name,
        })

        return reply.status(200).send(user)
    } catch (error) {
        console.log('error', error)
        if (error instanceof z.ZodError) {
            return reply.status(400).send({
                message: "Parâmetros inválidos",
                errors: error.errors
            });
        }

        if (error instanceof ResourceNotFoundError) {
            return reply.status(404).send({
                message: "Usuário não encontrado"
            });
        }

    }

}