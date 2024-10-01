import '@fastify/jwt'
import 'fastify'

declare module '@fastify/jwt' {
    export interface FastifyJWT {
        user: {
            sub: string
        },
    }
}
