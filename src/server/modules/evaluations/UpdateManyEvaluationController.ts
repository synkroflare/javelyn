import { PrismaClient, Evaluation } from "@prisma/client"
import { Request, Response } from "express"
import { container, inject, injectable } from "tsyringe"

type TUpdateManyEvaluationData = {
  where: any
  data: {}
  include?: any
  skip?: any
  take?: any
}

export class UpdateManyEvaluationController {
  async handle(request: Request, response: Response): Promise<Response> {
    try {
      const data = request.body
      const updateEvaluationUseCase = container.resolve(
        UpdateManyEvaluationUseCase
      )
      const updateEvaluations = await updateEvaluationUseCase.execute(data)

      return response.status(201).json(updateEvaluations)
    } catch (error: any) {
      return response.status(400).send(error.message)
    }
  }
}

@injectable()
export class UpdateManyEvaluationUseCase {
  constructor(
    @inject("PrismaClient")
    private readonly client: PrismaClient
  ) {}

  async execute(data: TUpdateManyEvaluationData): Promise<number> {
    if (!data.where || Object.keys(data).length === 0) {
      console.error(
        "CANCELED ACTION: Trying to updateMany evaluations without a WHERE clause."
      )
      return 0
    }
    const updateEvaluations = await this.client.evaluation.updateMany(data)

    return updateEvaluations.count
  }
}
