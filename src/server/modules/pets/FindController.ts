import { PrismaClient, Pet } from "@prisma/client"
import { Request, Response } from "express"
import { container, inject, injectable } from "tsyringe"

type TFindPetsData = {
  where: {
    companyId: number
    OR: any[]
    AND: any[]
  }
  include?: {}
  skip?: number
  take?: number
}

export class FindPetsController {
  async handle(request: Request, response: Response): Promise<Response> {
    try {
      const data = request.body
      const findPetUseCase = container.resolve(FindPetsUseCase)
      const foundPets = await findPetUseCase.execute(data)

      return response.status(201).json({
        meta: {
          status: 200,
          message: "O pet foi encontrado com sucesso.",
        },
        objects: [foundPets],
      })
    } catch (error: any) {
      return response.status(400).send(error.message)
    }
  }
}

@injectable()
export class FindPetsUseCase {
  constructor(
    @inject("PrismaClient")
    private readonly client: PrismaClient
  ) {}

  async execute(data: TFindPetsData): Promise<Pet[] | void> {
    return await this.client.pet.findMany(data)
  }
}
