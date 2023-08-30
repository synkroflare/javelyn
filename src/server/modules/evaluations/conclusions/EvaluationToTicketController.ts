import {
  Ticket,
  Lead,
  PrismaClient,
  Task,
  Evaluation,
  Client,
} from "@prisma/client"
import { Request, Response } from "express"
import { JavelynResponse } from "server/modules/leads/CreateLeadController"
import { container, inject, injectable } from "tsyringe"

type TRequest = {
  evaluation: {
    where: any
    data: any
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
  target: {
    where: {}
    data: Lead | Client
    include?: any
    skip?: any
    take?: any
  }
}

export class EvaluationToTicketController {
  async handle(request: Request, response: Response): Promise<Response> {
    try {
      const data = request.body
      const ticketToTicketUseCase = container.resolve(EvaluationToTicketUseCase)
      const ticketToTicket = await ticketToTicketUseCase.execute(data)

      return response.status(201).json(ticketToTicket)
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
export class EvaluationToTicketUseCase {
  constructor(
    @inject("PrismaClient")
    private readonly client: PrismaClient
  ) {}

  async execute(data: TRequest): Promise<JavelynResponse> {
    if (!data.evaluation || !data.ticket || !data.target)
      throw new Error("Erro: dados insuficientes.")
    const evaluation = () => this.client.task.update(data.evaluation)
    const ticket = () => this.client.ticket.create(data.ticket)

    let client: Client | undefined | null

    if ("leadStatus" in data.target.data) {
      const lead = await this.client.lead.findFirst({
        where: {
          id: data.target.data.id,
        },
        include: {
          client: true,
        },
      })
      if (lead?.client) client = lead?.client
      else {
      }
    }

    const objects = await this.client.$transaction([evaluation(), ticket()])

    return {
      meta: {
        message: "A avaliação foi convertida para um novo ticket de venda.",
        status: 200,
      },
      objects,
    }
  }
}
