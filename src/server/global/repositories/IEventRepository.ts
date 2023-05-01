import { Prisma } from "@prisma/client"
import { IEvent } from "../models/IEvent"

export type TCreateEventData = {
  companyId: number

  name: string | null
  type: string
  date: Date

  statusTrashed: boolean | undefined
  statusHandled: boolean | undefined

  handledAt: Date | undefined
  trashedAt: Date | undefined
}

export type TFindEventData = {
  where: {
    id: number
    companyId: number
  }
  include: any
}

export type TFindEventWithFiltersData = {
  value: any
}

export type TUpdateEventData = {
  data: {
    id: number
    companyId: number
  }
  where: any
}

export interface IEventRepository {
  create(data: TCreateEventData): Promise<IEvent | void>
  find(data: TFindEventData): Promise<IEvent[] | void>
  update(data: TUpdateEventData): Promise<IEvent | void>
  updateMany(data: TUpdateEventData): Promise<Prisma.BatchPayload | void>
}
