import { Request, Response } from "express"
import { container, inject, injectable } from "tsyringe"
import { ITicket } from "../../global/models/ITicket"
import {
  ITicketRepository,
  TUpdateTicketData,
} from "../../global/repositories/ITicketRepository"

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
      return response.status(400).send(error.message)
    }
  }
}

@injectable()
export class UpdateTicketUseCase {
  constructor(
    @inject("TicketRepository")
    private ticketRepository: ITicketRepository
  ) {}

  async execute(data: TUpdateTicketData): Promise<ITicket | void> {
    const updateTicket = await this.ticketRepository.update(data)
    return updateTicket
  }
}
