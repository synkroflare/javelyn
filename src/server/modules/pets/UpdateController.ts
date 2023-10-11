import { PrismaClient, Pet } from "@prisma/client"
import { Request, Response } from "express"
import { container, inject, injectable } from "tsyringe"

type TRequest = {
  where: {}
  data: {}
  include?: any
  skip?: any
  take?: any
}

export class UpdatePetController {
  async handle(request: Request, response: Response): Promise<Response> {
    try {
      const data = request.body
      const updatePetUseCase = container.resolve(UpdatePetUseCase)
      const updatePet = await updatePetUseCase.execute(data)

      return response.status(201).json({
        meta: {
          status: 200,
          message: "O pet foi atualizado com sucesso.",
        },
        objects: [updatePet],
      })
    } catch (error: any) {
      return response.status(400).send(error.message)
    }
  }
}

@injectable()
export class UpdatePetUseCase {
  constructor(
    @inject("PrismaClient")
    private readonly client: PrismaClient
  ) {}

  async execute(data: TRequest): Promise<Pet | void> {
    const updatePet = await this.client.pet.update(data)
    return updatePet
  }
}
