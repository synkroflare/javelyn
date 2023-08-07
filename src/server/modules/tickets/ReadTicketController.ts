import { PrismaClient } from "@prisma/client"
import { Request, Response } from "express"
import { container, inject, injectable } from "tsyringe"
import { JavelynResponse } from "../leads/CreateLeadController"

type TRequest = {
  id?: number
  companyId: number
}

export class ReadTicketController {
  async handle(request: Request, response: Response): Promise<Response> {
    try {
      const data = request.body
      const readTicketUseCase = container.resolve(ReadTicketUseCase)
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
export class ReadTicketUseCase {
  constructor(
    @inject("PrismaClient")
    private client: PrismaClient
  ) {}

  async execute(data: any): Promise<JavelynResponse | void> {
    const ticket = await this.client.ticket.findFirst(data)
    return {
      meta: {
        message: "Tickets encontrados.",
        status: 200,
      },
      objects: [ticket],
    }
  }
}
