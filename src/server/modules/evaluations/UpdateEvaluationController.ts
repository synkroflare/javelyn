import { PrismaClient, Evaluation } from "@prisma/client"
import { Request, Response } from "express"
import { container, inject, injectable } from "tsyringe"
import { JavelynResponse } from "../leads/CreateLeadController"

type TRequest = {
  evaluation: {
    where: Evaluation
    data: Evaluation
    include?: any
    skip?: any
    take?: any
  }
}

export class UpdateEvaluationController {
  async handle(request: Request, response: Response): Promise<Response> {
    try {
      const data = request.body
      const updateEvaluationUseCase = container.resolve(UpdateEvaluationUseCase)
      const updateEvaluation = await updateEvaluationUseCase.execute(data)

      return response.status(201).json(updateEvaluation)
    } catch (error: any) {
      return response.status(400).send({
        meta: {
          message: error.message,
          status: 400,
        },
        objects: null,
      })
    }
  }
}

@injectable()
export class UpdateEvaluationUseCase {
  constructor(
    @inject("PrismaClient")
    private readonly client: PrismaClient
  ) {}

  async execute(data: TRequest): Promise<JavelynResponse> {
    const updateEvaluation = await this.client.evaluation.update(
      data.evaluation
    )
    return {
      meta: {
        message: "Avaliação atualizada com sucesso.",
        status: 200,
      },
      objects: [updateEvaluation],
    }
  }
}
