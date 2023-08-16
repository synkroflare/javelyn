import { Ticket, Lead, PrismaClient, Task } from "@prisma/client"
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
  ticket: {
    data: any
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

export class TaskToTicketController {
  async handle(request: Request, response: Response): Promise<Response> {
    try {
      const data = request.body
      const taskToTicketUseCase = container.resolve(TaskToTicketUseCase)
      const taskToTicket = await taskToTicketUseCase.execute(data)

      return response.status(201).json(taskToTicket)
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
export class TaskToTicketUseCase {
  constructor(
    @inject("PrismaClient")
    private readonly client: PrismaClient
  ) {}

  async execute(data: TRequest): Promise<JavelynResponse> {
    if (!data.task || !data.ticket)
      throw new Error("Erro: dados insuficientes.")
    const task = this.client.task.update(data.task)
    const ticket = this.client.ticket.create(data.ticket)
    const lead = data.lead ? this.client.lead.update(data.lead) : undefined

    if (lead) await this.client.$transaction([task, ticket, lead])
    else await this.client.$transaction([task, ticket])

    return {
      meta: {
        message: "A tarefa foi convertida para um novo ticket de venda.",
        status: 200,
      },
      objects: [{ task }, { ticket }, { lead }],
    }
  }
}
