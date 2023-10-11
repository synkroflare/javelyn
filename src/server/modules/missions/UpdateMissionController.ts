import { PrismaClient, Mission } from "@prisma/client"
import { Request, Response } from "express"
import { container, inject, injectable } from "tsyringe"

type TRequest = {
  where: {}
  data: {}
  include?: any
  skip?: any
  take?: any
}

export class UpdateMissionController {
  async handle(request: Request, response: Response): Promise<Response> {
    try {
      const data = request.body
      const updateMissionUseCase = container.resolve(UpdateMissionUseCase)
      const updateMission = await updateMissionUseCase.execute(data)

      return response.status(201).json({
        meta: {
          status: 200,
          message: "A missão foi atualizada com sucesso.",
        },
        objects: [updateMission],
      })
    } catch (error: any) {
      return response.status(400).send(error.message)
    }
  }
}

@injectable()
export class UpdateMissionUseCase {
  constructor(
    @inject("PrismaClient")
    private readonly client: PrismaClient
  ) {}

  async execute(data: TRequest): Promise<Mission | void> {
    const updateMission = await this.client.mission.update(data)
    return updateMission
  }
}
