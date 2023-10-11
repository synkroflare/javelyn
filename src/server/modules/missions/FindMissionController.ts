import { PrismaClient, Mission } from "@prisma/client"
import { Request, Response } from "express"
import { container, inject, injectable } from "tsyringe"

type TFindMissionsData = {
  where: {
    companyId: number
    OR: any[]
    AND: any[]
  }
  include?: {}
  skip?: number
  take?: number
}

export class FindMissionsController {
  async handle(request: Request, response: Response): Promise<Response> {
    try {
      const data = request.body
      const findMissionUseCase = container.resolve(FindMissionsUseCase)
      const foundMissions = await findMissionUseCase.execute(data)

      return response.status(201).json({
        meta: {
          status: 200,
          message: "A missão foi encontrada com sucesso.",
        },
        objects: [foundMissions],
      })
    } catch (error: any) {
      return response.status(400).send(error.message)
    }
  }
}

@injectable()
export class FindMissionsUseCase {
  constructor(
    @inject("PrismaClient")
    private readonly client: PrismaClient
  ) {}

  async execute(data: TFindMissionsData): Promise<Mission[] | void> {
    return await this.client.mission.findMany(data)
  }
}
