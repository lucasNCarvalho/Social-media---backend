
import { makeAuthenticateFactory } from '@/services/factories/make-authenticate-factory';
import {FastifyRequest, FastifyReply} from 'fastify'

export async function logout(request:FastifyRequest, reply: FastifyReply) {

    try {

        const refreshToken = request.cookies.refreshToken;

        if (!refreshToken) {
            return reply.status(403).send({ error: 'No refresh token provided' });
        }

        const authenticate = makeAuthenticateFactory()

        authenticate.revokeByRefreshToken(refreshToken)

        return reply.clearCookie('refreshToken', {
            path: '/',
            secure: false,
            sameSite: true,
            httpOnly: true,
        })
        .status(204)
        .send({message: 'logged out successfully'})

    } catch (error) {   
        return reply.status(403).send({ error: 'Invalid or expired refresh token' });
    }
}