import { Evaluation, Lead, PrismaClient, Task } from "@prisma/client"
import { Request, Response } from "express"
import { JavelynResponse } from "server/modules/leads/CreateLeadController"
import { container, inject, injectable } from "tsyringe"

type TRequest = {
  task: {
    where: {}
    data: Task
    include?: any
    skip?: any
    take?: any
  }
  evaluation: {
    data: Evaluation
    include?: any
    skip?: any
    take?: any
  }
  lead: {
    where: {}
    data: Lead
    include?: any
    skip?: any
    take?: any
  }
}

export class TaskToEvaluationController {
  async handle(request: Request, response: Response): Promise<Response> {
    try {
      const data = request.body
      const taskToEvaluationUseCase = container.resolve(TaskToEvaluationUseCase)
      const taskToEvaluation = await taskToEvaluationUseCase.execute(data)

      return response.status(201).json(taskToEvaluation)
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
export class TaskToEvaluationUseCase {
  constructor(
    @inject("PrismaClient")
    private readonly client: PrismaClient
  ) {}

  async execute(data: TRequest): Promise<JavelynResponse> {
    if (!data.task || !data.evaluation)
      throw new Error("Erro: dados insuficientes.")
    const task = this.client.task.update(data.task)
    const evaluation = this.client.evaluation.create(data.evaluation)
    const lead = data.lead ? this.client.lead.update(data.lead) : undefined

    if (lead) await this.client.$transaction([task, evaluation, lead])
    else await this.client.$transaction([task, evaluation])

    return {
      meta: {
        message: "A tarefa foi convertida para uma nova avaliação.",
        status: 200,
      },
      objects: [{ task }, { evaluation }, { lead }],
    }
  }
}
