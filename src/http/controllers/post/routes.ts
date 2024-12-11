import { FastifyInstance } from "fastify";
import { create } from "./create";
import { verifyJWT } from "../middlewares/verify-jwt";
import { getPost } from "./get";
import { updatePost } from "./update";
import { deletePost } from "./delete";
import { getListLikeByPost } from "./getListLikeByPost";
import { getMostLikedPosts } from "./getMostLikedPosts";

export async function postRoutes(app: FastifyInstance) {
    app.addHook('onRequest',  verifyJWT)

    app.post('/post', create)
    app.get('/post/:postId?', getPost)
    app.get('/post/likes/:postId', getListLikeByPost)
    app.patch('/post/:postId', updatePost)
    app.delete('/post/:postId', deletePost)
    app.get('/posts/topPost/week', getMostLikedPosts)
}