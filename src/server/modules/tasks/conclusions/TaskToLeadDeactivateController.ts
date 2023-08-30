import { Task, Lead, PrismaClient, Quote } from "@prisma/client"
import { Request, Response } from "express"
import { JavelynResponse } from "server/modules/leads/CreateLeadController"
import { container, inject, injectable } from "tsyringe"

type TRequest = {
  task: {
    where: Task
    data: Task
    include?: any
    skip?: any
    take?: any
  }
  lead: {
    where: {
      id: number
    }
    data: Lead
    include?: any
    skip?: any
    take?: any
  }
}

export class TaskToLeadDeactivateController {
  async handle(request: Request, response: Response): Promise<Response> {
    try {
      const data = request.body
      const taskToDeactivationUseCase = container.resolve(
        TaskToDeactivationUseCase
      )
      const taskToDeactivation = await taskToDeactivationUseCase.execute(data)

      return response.status(201).json(taskToDeactivation)
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
export class TaskToDeactivationUseCase {
  constructor(
    @inject("PrismaClient")
    private readonly client: PrismaClient
  ) {}

  async execute(data: TRequest): Promise<JavelynResponse> {
    if (!data.task?.data || !data.lead?.data)
      throw new Error("Erro: dados insuficientes.")
    const task = this.client.task.update(data.task)
    const lead = this.client.lead.update(data.lead)

    const objects = await this.client.$transaction([task, lead])

    return {
      meta: {
        message: `O lead foi desativado com sucesso pelo motivo: ${
          (await lead).trashedReason
        }`,
        status: 200,
      },
      objects,
    }
  }
}
