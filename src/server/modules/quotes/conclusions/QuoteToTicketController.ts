import { Ticket, Lead, PrismaClient, Task, Quote, Client } from "@prisma/client"
import { Request, Response } from "express"
import { JavelynResponse } from "server/modules/leads/CreateLeadController"
import { container, inject, injectable } from "tsyringe"

type TRequest = {
  quotes: Quote[]
  ticket: {
    data: any
    include?: any
    skip?: any
    take?: any
  }
  client: {
    where: {}
    create: Client
    update: Client
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
    if (!data.quotes || !data.ticket || !data.client)
      throw new Error("Erro: dados insuficientes.")
    const quotes = await this.client.quote.findMany({
      where: {
        id: {
          in: data.quotes.map((quote) => quote.id),
        },
      },
      include: {
        tasks: true,
      },
    })
    if (!quotes || quotes.length === 0)
      throw new Error("ERRO: não foi possível nenhum orçamento.")

    const taskIds = quotes
      .map((quote) => quote.tasks.map((task) => task.id))
      .flat()

    const updateTasks = this.client.task.updateMany({
      where: {
        id: {
          in: taskIds,
        },
      },
      data: {
        statusHandled: true,
        handledAtDate: new Date(),
        conclusionCategory: "QUOTE-TO-TICKET",
        conclusion:
          "Esta tarefa foi finalizada automáticamente devido à venda realizada.",
      },
    })

    const updateQuotes = this.client.quote.updateMany({
      where: {
        id: {
          in: data.quotes.map((quote) => quote.id),
        },
      },
      data: {
        statusAccomplished: true,
        statusAbsent: false,
      },
    })

    const client = await this.client.client.upsert(data.client)

    const prismaPromises: any[] = []

    const ticket = await this.client.ticket.create(data.ticket)

    return {
      meta: {
        message: "A tarefa foi convertida para um novo ticket de venda.",
        status: 200,
      },
      objects: [{ client }, { ticket }, { updateQuotes }],
    }
  }
}
