import { FastifyInstance } from "fastify";
import { followUser } from "./followUser";
import { checkFollow } from "./checkFollow";




export async function followRoutes(app: FastifyInstance) {
    app.get('/follow/:userId', checkFollow)
    app.post('/follow', followUser)
}