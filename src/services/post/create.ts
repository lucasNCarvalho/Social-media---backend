import { Post } from "@prisma/client";
import { prisma } from "@/lib/prisma";
import { PrismaPostRepository } from "@/repositories/prisma/prisma-posts-repository";
import { ResourceNotFoundError } from "../erros/resource-not-found-error";
import { PrismaUserRepository } from "@/repositories/prisma/prisma-users-repository";

interface CreatePostServiceRequest {
    caption: string;
    tags: string;
    location?: string;
    creatorId: string; 
    image: {
      url: string;
      imageName: string;
      key: string;
      typeImage: string;
    };
  }

interface CreatePostServiceResponse {
  post: Post;
}

export class CreatePostService {
  private postRepository: PrismaPostRepository;
  private userRepository: PrismaUserRepository

  constructor(postRepository: PrismaPostRepository, userRepository: PrismaUserRepository) {
    this.postRepository = postRepository;
    this.userRepository = userRepository
  }

  async execute({
    caption,
    tags,
    location,
    creatorId,
    image,
  }: CreatePostServiceRequest): Promise<CreatePostServiceResponse> {

    const userExists = await this.userRepository.findById(creatorId)
  
    if (!userExists) {
       
      throw new ResourceNotFoundError();
    }

  
    const post = await this.postRepository.create({
        caption,
        tags: tags.split(","), 
        location,
        creator: { connect: { id: creatorId } },
        image: {
          create: {
            url: image.url,
            fileName: image.imageName,
            key: image.key,
            typeFile: image.typeImage,
          },
        },
      });

    return {
      post,
    };
  }
}
