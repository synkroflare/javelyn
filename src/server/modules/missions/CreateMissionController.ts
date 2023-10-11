import { PrismaClient, Mission } from "@prisma/client"
import { Request, Response } from "express"
import { container, inject, injectable } from "tsyringe"

export type JavelynResponse = {
  meta: {
    status: number
    message: string
  }
  objects: any
}

export class CreateMissionController {
  async handle(request: Request, response: Response): Promise<Response> {
    try {
      const data = request.body
      const createMissionUseCase = container.resolve(CreateMissionUseCase)
      const createMission = await createMissionUseCase.execute(data)

      return response.status(200).json(createMission)
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
export class CreateMissionUseCase {
  constructor(
    @inject("PrismaClient")
    private readonly client: PrismaClient
  ) {}

  async execute(data: any): Promise<JavelynResponse | void> {
    const createMission = await this.client.mission.create(data)
    return {
      meta: {
        status: 200,
        message: "A missão foi criado com sucesso.",
      },
      objects: [createMission],
    }
  }
}
