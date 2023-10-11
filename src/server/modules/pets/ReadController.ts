import { PrismaClient, Pet } from "@prisma/client"
import { Request, Response } from "express"
import { container, inject, injectable } from "tsyringe"

type TReadPetsData = {
  where: {
    companyId: number
    OR: any[]
    AND: any[]
  }
  include?: {}
  skip?: number
  take?: number
}

export class ReadPetsController {
  async handle(request: Request, response: Response): Promise<Response> {
    try {
      const data = request.body
      const findPetUseCase = container.resolve(ReadPetsUseCase)
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
export class ReadPetsUseCase {
  constructor(
    @inject("PrismaClient")
    private readonly client: PrismaClient
  ) {}

  async execute(data: TReadPetsData): Promise<Pet | null> {
    return await this.client.pet.findFirst(data)
  }
}
