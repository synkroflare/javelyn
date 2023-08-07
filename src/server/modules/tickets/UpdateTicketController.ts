import { PrismaClient } from "@prisma/client"
import { Request, Response } from "express"
import { container, inject, injectable } from "tsyringe"
import { ITicket } from "../../global/models/ITicket"
import {
  ITicketRepository,
  TUpdateTicketData,
} from "../../global/repositories/ITicketRepository"
import { JavelynResponse } from "../leads/CreateLeadController"

export class UpdateTicketController {
  async handle(request: Request, response: Response): Promise<Response> {
    try {
      const data = request.body
      const updateTicketUseCase = container.resolve(UpdateTicketUseCase)
      const updateTicket = await updateTicketUseCase.execute(data)

      const json = JSON.stringify(
        updateTicket,
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
export class UpdateTicketUseCase {
  constructor(
    @inject("PrismaClient")
    private client: PrismaClient
  ) {}

  async execute(data: any): Promise<JavelynResponse | void> {
    const updateTicket = await this.client.ticket.update(data)
    return {
      meta: {
        message: "Tickets atualizados.",
        status: 200,
      },
      objects: [updateTicket],
    }
  }
}
