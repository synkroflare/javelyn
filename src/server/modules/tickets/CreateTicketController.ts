import { PrismaClient } from "@prisma/client"
import { Request, Response } from "express"
import { container, inject, injectable } from "tsyringe"
import { ITicket } from "../../global/models/ITicket"
import { ITicketRepository } from "../../global/repositories/ITicketRepository"
import { JavelynResponse } from "../leads/CreateLeadController"

export class CreateTicketController {
  async handle(request: Request, response: Response): Promise<Response> {
    try {
      const data = request.body
      const createTicketUseCase = container.resolve(CreateTicketUseCase)
      const createTicket = await createTicketUseCase.execute(data)

      return response.status(201).json(createTicket)
    } catch (error: any) {
      return response.status(400).send({
        meta: {
          status: 200,
          message: error.message,
        },
        objects: null,
      })
    }
  }
}

@injectable()
export class CreateTicketUseCase {
  constructor(
    @inject("PrismaClient")
    private client: PrismaClient
  ) {}

  async execute(data: any): Promise<JavelynResponse> {
    const createTicket = await this.client.ticket.create(data)
    return {
      meta: {
        status: 200,
        message: "Ticket criado com sucesso!",
      },
      objects: [createTicket],
    }
  }
}
