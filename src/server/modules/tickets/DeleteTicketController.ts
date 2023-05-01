import { Request, Response } from "express"
import { container, inject, injectable } from "tsyringe"
import { ITicket } from "../../global/models/ITicket"
import { ITicketRepository } from "../../global/repositories/ITicketRepository"

type TRequest = {
  type: string
  userId: number
  id: number
}

export class DeleteTicketController {
  async handle(request: Request, response: Response): Promise<Response> {
    try {
      const data = request.body
      const deleteTicketUseCase = container.resolve(DeleteTicketUseCase)
      const deleteTicket = await deleteTicketUseCase.execute(data)

      return response.status(201).json(deleteTicket)
    } catch (error: any) {
      return response.status(400).send(error.message)
    }
  }
}

@injectable()
export class DeleteTicketUseCase {
  constructor(
    @inject("TicketRepository")
    private ticketRepository: ITicketRepository
  ) {}

  async execute(data: TRequest): Promise<ITicket | void> {
    const deleteTicket = await this.ticketRepository.delete(data)
    return deleteTicket
  }
}
