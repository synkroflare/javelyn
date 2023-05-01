import { Prisma, PrismaClient } from "@prisma/client"
import { inject, injectable } from "tsyringe"
import { IEvent } from "../../models/IEvent"
import {
  IEventRepository,
  TCreateEventData,
  TFindEventData,
  TUpdateEventData,
} from "../IEventRepository"

@injectable()
export class EventFunctionsRepository implements IEventRepository {
  constructor(
    @inject("PrismaClient")
    private readonly client: PrismaClient
  ) {}
  async update(data: TUpdateEventData): Promise<void | IEvent> {
    const events = await this.client.event.update(data)

    return events
  }
  async updateMany(
    data: TUpdateEventData
  ): Promise<Prisma.BatchPayload | void> {
    const events = await this.client.event.updateMany(data)

    return events
  }

  async create(data: TCreateEventData): Promise<IEvent | void> {
    const event = await this.client.event.create({ data })
    return event
  }

  async find(data: TFindEventData): Promise<IEvent[] | void> {
    const events = await this.client.event.findMany(data)
    return events
  }
}
