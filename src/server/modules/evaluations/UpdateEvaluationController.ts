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

  async execute(data: any): Promise<Evaluation | void> {
    if (data?.data.statusAbsent === true && data.where.id) {
      const evaluation = await this.client.evaluation.findUnique({
        where: data.where,
        include: {
          client: {
            select: {
              name: true,
              responsibleUserId: true,
            },
          },
          lead: {
            select: {
              name: true,
              creatorId: true,
            },
          },
          creator: {
            select: {
              name: true,
            },
          },
        },
      })
      if (!evaluation) return
      const targetId = evaluation.leadId ?? evaluation.clientId
      if (!targetId) return

      const targetName = evaluation.lead?.name ?? evaluation.client?.name
      const targetType = evaluation.lead ? "leadTargets" : "targets"

      const taskDate = new Date()
      taskDate.setDate(taskDate.getDate() + 1)

      const targetUpdate = evaluation.lead
        ? this.client.lead.updateMany({
            where: {
              id: targetId,
            },
            data: {
              absences: {
                increment: 1,
              },
              leadStatus: "LEAD",
            },
          })
        : this.client.client.updateMany({
            where: {
              id: targetId,
            },
            data: {
              absences: {
                increment: 1,
              },
            },
          })

      const prismaOps = await this.client.$transaction([
        this.client.evaluation.update(data),
        targetUpdate,
        this.client.task.create({
          data: {
            companyId: evaluation.companyId,
            targetDate: taskDate,
            category: "FALTA",
            title: `Resgate de falta de avaliação`,
            body: `Esta task foi gerada automaticamente. \n\n ${targetName} faltou à uma avaliação marcada por ${
              evaluation.creator.name
            } para ${evaluation.targetDate?.toLocaleString()}`,
            creatorId:
              evaluation.lead?.creatorId ??
              evaluation.client?.responsibleUserId ??
              evaluation.creatorId,
            [targetType]: {
              connect: {
                id: targetId,
              },
            },
          },
        }),
      ])
      return prismaOps[0]
    }
    const updateEvaluation = await this.client.evaluation.update(data)
    return updateEvaluation
  }
}
