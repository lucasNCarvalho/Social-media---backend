import { FastifyInstance } from "fastify";
import { register } from "./register";
import { authenticate } from "./authenticate";
import { refresh } from "./refresh";
import { profile } from "./profile";
import { logout } from "./logout";



export async function userRoutes(app: FastifyInstance) {
    app.post('/users', register)
    app.delete('/logout', logout)
    app.post('/sessions', authenticate)
    app.patch('/token/refresh', refresh)
    app.get('/profile/:userId?', profile)
}