import { PrismaClient, Evaluation } from "@prisma/client"
import { Request, Response } from "express"
import { container, inject, injectable } from "tsyringe"

type TRequest = {
  where: {}
  data: {}
  include?: any
  skip?: any
  take?: any
}

export class UpdateEvaluationController {
  async handle(request: Request, response: Response): Promise<Response> {
    try {
      const data = request.body
      const updateEvaluationUseCase = container.resolve(UpdateEvaluationUseCase)
      const updateEvaluation = await updateEvaluationUseCase.execute(data)

      return response.status(201).json(updateEvaluation)
    } catch (error: any) {
      return response.status(400).send(error.message)
    }
  }
}

@injectable()
export class UpdateEvaluationUseCase {
  constructor(
    @inject("PrismaClient")
    private readonly client: PrismaClient
  ) {}

  async execute(data: TRequest): Promise<Evaluation | void> {
    const updateEvaluation = await this.client.evaluation.update(data)
    return updateEvaluation
  }
}
