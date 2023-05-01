import { Request, Response } from "express"
import { container, inject, injectable } from "tsyringe"
import { IEvent } from "../../global/models/IEvent"
import { IEventRepository } from "../../global/repositories/IEventRepository"

type TRequest = {
  type: string
  userId: number
}

export class CreateEventController {
  async handle(request: Request, response: Response): Promise<Response> {
    try {
      const data = request.body
      const createEventUseCase = container.resolve(CreateEventUseCase)
      const createEvent = await createEventUseCase.execute(data)

      return response.status(201).json(createEvent)
    } catch (error: any) {
      return response.status(400).send(error.message)
    }
  }
}

@injectable()
export class CreateEventUseCase {
  constructor(
    @inject("EventRepository")
    private eventRepository: IEventRepository
  ) {}

  async execute(data: any): Promise<IEvent | void> {
    const createEvent = await this.eventRepository.create(data)
    return createEvent
  }
}
