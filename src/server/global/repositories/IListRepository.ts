import { Prisma } from "@prisma/client"
import { JsonValue } from "infra/types"
import { IList } from "../models/IList"

export type TCreateListData = {
  name?: string
  description?: string
  filters: JsonValue
  companyId: number
  creatorId: number
}

export type TFindListData = {
  mode: string
  id?: number
  companyId: number
  creatorId?: number
  name?: string
  description?: string
  filters?: JsonValue

  javelynThrows?: number
  javelynThrowsDates: Date[]

  statusTrashed?: boolean
}

export type TFindListByNameData = {
  name: string
  companyId: number
}

export type TUpdateListParticipantsData = {
  companyId: number
  id: number
  filters: JsonValue
  mode?: string
}

export type TUpdateListData = {
  data: {
    mode: string
    id?: number
    companyId: number
    creatorId?: number
    name?: string
    description?: string
    filters: JsonValue

    javelynThrows?: number
    javelynThrowsDates?: Date[]

    statusTrashed?: boolean
    trashedAt?: Date | null
  }
  where: any
  include?: any | { pendingClients: true }
  select?: any
}

export interface IListRepository {
  create(data: TCreateListData): Promise<IList | void>
  find(data: TFindListData): Promise<IList[] | void>
  findByName(data: TFindListByNameData): Promise<IList[] | void>
  update(data: TUpdateListData): Promise<IList | void>
  updateMany(data: TUpdateListData): Promise<Prisma.BatchPayload | void>
  delete(data: TFindListData): Promise<IList | void>
}
