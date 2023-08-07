import { PrismaClient } from "@prisma/client"
import { Request, Response } from "express"
import { container, inject, injectable } from "tsyringe"
import { ITicket } from "../../global/models/ITicket"
import { ITicketRepository } from "../../global/repositories/ITicketRepository"
import { JavelynResponse } from "../leads/CreateLeadController"

type TRequest = {
  id?: number
  companyId: number
}

export class FindTicketController {
  async handle(request: Request, response: Response): Promise<Response> {
    try {
      const data = request.body
      const readTicketUseCase = container.resolve(FindTicketUseCase)
      const readTicket = await readTicketUseCase.execute(data)

      const json = JSON.stringify(
        readTicket,
        (key, value) => (typeof value === "bigint" ? Number(value) : value) // return everything else unchanged
      )

      return response.status(201).send(json)
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
export class FindTicketUseCase {
  constructor(
    @inject("PrismaClient")
    private client: PrismaClient
  ) {}

  async execute(data: any): Promise<JavelynResponse | void> {
    const tickets = await this.client.ticket.findMany(data)
    return {
      meta: {
        message: "Tickets encontrados.",
        status: 200,
      },
      objects: tickets,
    }
  }
}
