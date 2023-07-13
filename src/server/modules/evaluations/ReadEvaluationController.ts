import { PrismaClient, Evaluation } from "@prisma/client"
import { Request, Response } from "express"
import { container, inject, injectable } from "tsyringe"

type TReadEvaluationData = {
  where: {}
  include?: {}
}

export class ReadEvaluationController {
  async handle(request: Request, response: Response): Promise<Response> {
    try {
      const data = request.body
      const readEvaluationUseCase = container.resolve(ReadEvaluationUseCase)
      const readEvaluation = await readEvaluationUseCase.execute(data)

      return response.status(201).json(readEvaluation)
    } catch (error: any) {
      return response.status(400).send(error.message)
    }
  }
}

@injectable()
export class ReadEvaluationUseCase {
  constructor(
    @inject("PrismaClient")
    private readonly client: PrismaClient
  ) {}

  async execute(data: TReadEvaluationData): Promise<Evaluation | null> {
    const readEvaluation = await this.client.evaluation.findFirst(data)
    return readEvaluation
  }
}
