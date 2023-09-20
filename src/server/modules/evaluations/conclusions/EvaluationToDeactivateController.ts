import {
  Client,
  Evaluation,
  Lead,
  PrismaClient,
  Task,
  User,
} from "@prisma/client"
import { Request, Response } from "express"
import { JavelynResponse } from "server/modules/leads/CreateLeadController"
import { container, inject, injectable } from "tsyringe"

type TRequest = {
  evaluation: Evaluation
  target: Client | Lead
  targetType: string
  reason: string
  absence: boolean
}

export class EvaluationToDeactivateController {
  async handle(request: Request, response: Response): Promise<Response> {
    try {
      const data = request.body
      const evaluationToDeactivateUseCase = container.resolve(
        EvaluationToDeactivateUseCase
      )
      const evaluationToDeactivate =
        await evaluationToDeactivateUseCase.execute(data)

      return response.status(201).json(evaluationToDeactivate)
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
export class EvaluationToDeactivateUseCase {
  constructor(
    @inject("PrismaClient")
    private readonly client: PrismaClient
  ) {}

  async execute(data: TRequest): Promise<JavelynResponse> {
    if (!(data satisfies TRequest))
      throw new Error("Erro: dados insuficientes.")

    const { evaluation, target, targetType, reason, absence } = data

    const evaluationUpdate = this.client.evaluation.update({
      where: {
        id: evaluation.id,
      },
      data: {
        statusAccomplished: !absence,
        statusAbsent: absence,
        handledAtDate: new Date(),
        conclusionCategory: "EVALUATION-TO-DEACTIVATE",
      },
    })

    const targetUpdate =
      targetType === "lead"
        ? this.client.lead.update({
            where: {
              id: target.id,
            },
            data: {
              statusTrashed: true,
              trashedReason: reason,
              trashedAt: new Date(),
            },
          })
        : this.client.client.update({
            where: {
              id: target.id,
            },
            data: {
              statusTrashed: true,
              trashedReason: reason,
              trashedAt: new Date(),
            },
          })

    const prismaOps = await this.client.$transaction([
      evaluationUpdate,
      targetUpdate,
    ])

    return {
      meta: {
        message:
          "A avaliação foi marcada como concluida e o lead/cliente foi desativado.",
        status: 200,
      },
      objects: prismaOps,
    }
  }
}
