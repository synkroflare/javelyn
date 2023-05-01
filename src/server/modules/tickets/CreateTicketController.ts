import { Request, Response } from "express"
import { container, inject, injectable } from "tsyringe"
import { ITicket } from "../../global/models/ITicket"
import { ITicketRepository } from "../../global/repositories/ITicketRepository"

type TRequest = {
  type: string
  userId: number
}

export class CreateTicketController {
  async handle(request: Request, response: Response): Promise<Response> {
    try {
      const data = request.body
      const createTicketUseCase = container.resolve(CreateTicketUseCase)
      const createTicket = await createTicketUseCase.execute(data)

      return response.status(201).json(createTicket)
    } catch (error: any) {
      return response.status(400).send(error.message)
    }
  }
}

@injectable()
export class CreateTicketUseCase {
  constructor(
    @inject("TicketRepository")
    private ticketRepository: ITicketRepository
  ) {}

  async execute(data: any): Promise<ITicket | void> {
    const createTicket = await this.ticketRepository.create(data)
    return createTicket
  }
}
