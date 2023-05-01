import { Request, Response } from "express"
import { container, inject, injectable } from "tsyringe"
import { IEvent } from "../../global/models/IEvent"
import { IEventRepository } from "../../global/repositories/IEventRepository"

type TRequest = {
  id?: number
  companyId: number
}

export class FindEventController {
  async handle(request: Request, response: Response): Promise<Response> {
    try {
      const data = request.body
      const readEventUseCase = container.resolve(FindEventUseCase)
      const readEvent = await readEventUseCase.execute(data)

      const json = JSON.stringify(
        readEvent,
        (key, value) => (typeof value === "bigint" ? Number(value) : value) // return everything else unchanged
      )

      return response.status(201).send(json)
    } catch (error: any) {
      return response.status(400).send(error.message)
    }
  }
}

@injectable()
export class FindEventUseCase {
  constructor(
    @inject("EventRepository")
    private eventRepository: IEventRepository
  ) {}

  async execute(data: TRequest): Promise<IEvent[] | void> {
    const readEvent = await this.eventRepository.find(data)
    return readEvent
  }
}
