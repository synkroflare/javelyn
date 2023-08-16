import { Quote, Lead, PrismaClient, Task } from "@prisma/client"
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
  quote: {
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

export class TaskToQuoteController {
  async handle(request: Request, response: Response): Promise<Response> {
    try {
      const data = request.body
      const taskToQuoteUseCase = container.resolve(TaskToQuoteUseCase)
      const taskToQuote = await taskToQuoteUseCase.execute(data)

      return response.status(201).json(taskToQuote)
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
export class TaskToQuoteUseCase {
  constructor(
    @inject("PrismaClient")
    private readonly client: PrismaClient
  ) {}

  async execute(data: TRequest): Promise<JavelynResponse> {
    if (!data.task || !data.quote) throw new Error("Erro: dados insuficientes.")
    const task = this.client.task.update(data.task)
    const quote = this.client.quote.create(data.quote)
    const lead = data.lead ? this.client.lead.update(data.lead) : undefined

    if (lead) await this.client.$transaction([task, quote, lead])
    else await this.client.$transaction([task, quote])

    return {
      meta: {
        message: "A tarefa foi convertida para um novo orçamento.",
        status: 200,
      },
      objects: [{ task }, { quote }, { lead }],
    }
  }
}
