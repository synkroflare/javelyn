import { Prisma } from "@prisma/client"
import { Request, Response } from "express"
import { container, inject, injectable } from "tsyringe"
import {
  IEventRepository,
  TUpdateEventData,
} from "../../global/repositories/IEventRepository"

export class UpdateEventController {
  async handle(request: Request, response: Response): Promise<Response> {
    try {
      const data = request.body
      const updateEventUseCase = container.resolve(UpdateEventUseCase)
      const updateEvent = await updateEventUseCase.execute(data)

      const json = JSON.stringify(
        updateEvent,
        (key, value) => (typeof value === "bigint" ? Number(value) : value) // return everything else unchanged
      )

      return response.status(201).send(json)
    } catch (error: any) {
      return response.status(400).send(error.message)
    }
  }
}

@injectable()
export class UpdateEventUseCase {
  constructor(
    @inject("EventRepository")
    private eventRepository: IEventRepository
  ) {}

  async execute(data: TUpdateEventData): Promise<Prisma.BatchPayload | void> {
    const updateEvent = await this.eventRepository.updateMany(data)
    return updateEvent
  }
}
