
import { ResourceNotFoundError } from "@/services/erros/resource-not-found-error";
import { makeUploadFactory } from "@/services/factories/image/make-upload-factory";
import { makeCreatePostFactory } from "@/services/factories/post/make-create-post-factory";
import { processParts } from "@/utils/processParts";
import { FastifyReply, FastifyRequest } from "fastify";
import { z } from "zod";

export async function create(request: FastifyRequest, reply: FastifyReply) {
    const createBodySchema = z.object({
        caption: z.string().min(1),
        image: z.object({
            data: z.instanceof(Buffer),
            name: z.string().min(1),
        }),
        location: z.string().optional(),
        tags: z.string().min(1)
    })


    const allowedFields = ['caption', 'location', 'tags']
    try {
  
        const parts = await processParts({ request, allowedFields })
      
        const { caption, image, location, tags } = createBodySchema.parse(parts)

        const imageUpload = makeUploadFactory() 
        
        const uploadedImage = await imageUpload.execute(image)

   
        const createPost = makeCreatePostFactory()
       
        await createPost.execute({caption, image: uploadedImage, location, tags, creatorId: request.user.sub})

        return reply.status(201).send()
    } catch (error) {
        console.error('Erro na criação do post:', error);
        if(error instanceof ResourceNotFoundError) {
            return reply.status(404).send({ error: "Resource not found" });
        }

        return reply.status(500).send({error: "Internal Server Error"})
    }
}