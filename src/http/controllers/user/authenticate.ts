
import { InvalidCredentialsError } from "@/services/erros/invalid-credentials-error";
import { makeAuthenticateFactory } from "@/services/factories/make-authenticate-factory";
import { FastifyReply, FastifyRequest } from "fastify";
import {  z } from "zod";

export async function authenticate(request: FastifyRequest, reply: FastifyReply) {
    const authenticateBodySchema = z.object({
        email: z.string().email(),
        password: z.string().min(6)
    })

    const {email, password} = authenticateBodySchema.parse(request.body)
    console.log('autenticando')
    try {
        const authenticate = makeAuthenticateFactory()

        const {user} = await authenticate.execute({
            email,
            password
        })

        const token = await reply.jwtSign({}, {
            sign: {
             sub: user.id
            }
        })

        const refreshToken = await reply.jwtSign({}, {
            sign: {
             sub: user.id,
             expiresIn: '1m'
            }
        })

        authenticate.saveRefreshToken({refreshToken, userId: user.id})

       //todo: produção o secure precisa ser true, provavelmente usar um .env aqui
       return reply
       .setCookie('refreshToken', refreshToken, {
           path: '/',
           secure: false,
           sameSite: true,
           httpOnly: true,
       })
       .status(200)
       .send({
           token
       })

    } catch (error) {
        if (error instanceof InvalidCredentialsError) {
            return reply.status(403).send({ error: error.message })
        }

        throw error
    }
    
}