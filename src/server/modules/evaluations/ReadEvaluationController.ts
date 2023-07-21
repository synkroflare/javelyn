import { PrismaClient, Evaluation } from "@prisma/client"
import { Request, Response } from "express"
import { container, inject, injectable } from "tsyringe"
import { JavelynResponse } from "../leads/CreateLeadController"

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
export class ReadEvaluationUseCase {
  constructor(
    @inject("PrismaClient")
    private readonly client: PrismaClient
  ) {}

  async execute(data: TReadEvaluationData): Promise<JavelynResponse> {
    const readEvaluation = await this.client.evaluation.findFirst(data)
    return {
      meta: {
        status: 200,
        message: "Sucesso",
      },
      objects: [readEvaluation],
    }
  }
}
