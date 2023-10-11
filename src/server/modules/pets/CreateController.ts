import { PrismaClient, Pet } from "@prisma/client"
import { Request, Response } from "express"
import { container, inject, injectable } from "tsyringe"

export type JavelynResponse = {
  meta: {
    status: number
    message: string
  }
  objects: any
}

export class CreatePetController {
  async handle(request: Request, response: Response): Promise<Response> {
    try {
      const data = request.body
      const createPetUseCase = container.resolve(CreatePetUseCase)
      const createPet = await createPetUseCase.execute(data)

      return response.status(200).json(createPet)
    } catch (error: any) {
      return response.status(400).send({
        meta: {
          status: 400,
          message: error.message,
        },
        objects: null,
      })
    }
  }
}

@injectable()
export class CreatePetUseCase {
  constructor(
    @inject("PrismaClient")
    private readonly client: PrismaClient
  ) {}

  async execute(data: any): Promise<JavelynResponse | void> {
    const createPet = await this.client.pet.create(data)
    return {
      meta: {
        status: 200,
        message: "O pet foi criado com sucesso.",
      },
      objects: [createPet],
    }
  }
}
