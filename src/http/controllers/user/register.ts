import { UserEmailAlreadyExistsError } from "@/services/erros/userEmail-already-exists";
import { UserNameAlreadyExistsError } from "@/services/erros/userUserName-already-exists";
import { makeRegisterUserFactory } from "@/services/factories/make-registerUser-factory";
import { FastifyReply, FastifyRequest } from "fastify";
import { z } from "zod";

export async function register(request: FastifyRequest, reply: FastifyReply) {
    const registerBodySchema = z.object({
        name: z.string().min(1),
        userName: z.string().min(1),
        email: z.string().email(),
        password: z.string().min(6)
    })

    const { name, email, userName, password } = registerBodySchema.parse(request.body)

    try {
        const registerService = makeRegisterUserFactory()

        await registerService.execute({
            name,
            email,
            userName,
            password
        })
    } catch (error) {
        if (error instanceof UserEmailAlreadyExistsError) {
            return reply.status(409).send({ error: error.message, field: 'email' })
        }

        if (error instanceof UserNameAlreadyExistsError) {
            return reply.status(409).send({error: error.message, field: 'userName'})
        }

        throw error
    }

    return reply.status(201).send()
}