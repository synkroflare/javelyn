import { PrismaClient, Evaluation } from "@prisma/client"
import { Request, Response } from "express"
import { container, inject, injectable } from "tsyringe"
import { JavelynResponse } from "../leads/CreateLeadController"

type TFindEvaluationsData = {
  where: {}
  include?: {}
  skip?: number
  take?: number
}

export class FindEvaluationsController {
  async handle(request: Request, response: Response): Promise<Response> {
    try {
      const data = request.body
      const findEvaluationUseCase = container.resolve(FindEvaluationsUseCase)
      const foundEvaluations = await findEvaluationUseCase.execute(data)

      return response.status(201).json(foundEvaluations)
    } catch (error: any) {
      return response.status(400).send({
        meta: {
          status: 200,
          message: error.message,
        },
        objects: null,
      })
    }
  }
}

@injectable()
export class FindEvaluationsUseCase {
  constructor(
    @inject("PrismaClient")
    private readonly client: PrismaClient
  ) {}

  async execute(data: TFindEvaluationsData): Promise<JavelynResponse | void> {
    const foundEvaluations = await this.client.evaluation.findMany(data)
    return {
      meta: {
        status: 200,
        message: "Avaliações encontradas com sucesso.",
      },
      objects: foundEvaluations,
    }
  }
}
