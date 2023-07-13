import { PrismaClient, Evaluation } from "@prisma/client"
import { Request, Response } from "express"
import { container, inject, injectable } from "tsyringe"

type TCreateEvaluationData = {
  data: any
  include?: {}
}

export class CreateEvaluationController {
  async handle(request: Request, response: Response): Promise<Response> {
    try {
      const data = request.body
      const createEvaluationUseCase = container.resolve(CreateEvaluationUseCase)
      const createEvaluation = await createEvaluationUseCase.execute(data)

      return response.status(201).json(createEvaluation)
    } catch (error: any) {
      return response.status(400).send(error.message)
    }
  }
}

@injectable()
export class CreateEvaluationUseCase {
  constructor(
    @inject("PrismaClient")
    private readonly client: PrismaClient
  ) {}

  async execute(data: TCreateEvaluationData): Promise<Evaluation | void> {
    const createEvaluation = await this.client.evaluation.create(data)
    return createEvaluation
  }
}
