import fastifyJwt from "@fastify/jwt";
import fastify from "fastify";
import { env } from "./env";
import { ZodError } from "zod";

import fastifyCookie from "@fastify/cookie";
import fastifyCors from "@fastify/cors";
import { userRoutes } from "./http/controllers/user/routes";
import fastifyMultipart from "@fastify/multipart";
import { postRoutes } from "./http/controllers/post/routes";
import { followRoutes } from "./http/controllers/follow/routes";


export const app = fastify()

app.register(fastifyMultipart, {
    limits: {
        fileSize: 50 * 1024 * 1024 
    }
});

app.register(fastifyCookie)

app.register(fastifyCors, {
    origin: "http://localhost:5173", 
    credentials: true, 
});
   
app.register(fastifyJwt, {
    secret: env.JWT_SECRET,
    cookie: {
        cookieName: 'refreshToken',
        signed: false,
    },
    sign: {
        expiresIn: '10m'
    }
})


// app.addHook('onRequest', (request, reply, done) => {
//     const allowedOrigin = 'http://localhost:5173';
//     const referer = request.headers['referer'] || '';

//     if (!referer.startsWith(allowedOrigin)) {
//         return reply.status(403).send({ error: 'Forbidden' });
//     }

//     done();
// });


app.register(userRoutes)
app.register(postRoutes)
app.register(followRoutes)


app.setErrorHandler((error, _, reply) => {

    if(error instanceof ZodError) {
        return reply 
            .status(400)
            .send({message: 'Validation error.', issue: error.format()})
    }   

    if(env.NODE_ENV !== 'production') {
        console.error(error)
    } 
 
    return reply.status(500).send({message: 'Internal server error'})
})