import { Request, Response } from "express"
import { container, inject, injectable } from "tsyringe"
import { ITicket } from "../../global/models/ITicket"
import { ITicketRepository } from "../../global/repositories/ITicketRepository"

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
      return response.status(400).send(error.message)
    }
  }
}

@injectable()
export class FindTicketUseCase {
  constructor(
    @inject("TicketRepository")
    private ticketRepository: ITicketRepository
  ) {}

  async execute(data: TRequest): Promise<ITicket[] | void> {
    const readTicket = await this.ticketRepository.findWithFilters(data)
    return readTicket
  }
}
