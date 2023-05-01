import { JsonValue } from "infra/types"
import { IClient } from "../models/IClient"
import { IGroup } from "../models/IGroup"

export type TCreateGroupData = {
  name?: string
  description?: string
  filters: JsonValue
  companyId: number
  creatorId: number
}

export type TFindGroupData = {
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

export type TFindGroupByNameData = {
  name: string
  companyId: number
}

export type TUpdateGroupParticipantsData = {
  companyId: number
  id: number
  filters: JsonValue
  mode?: string
}

export type TUpdateGroupData = {
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

export interface IGroupRepository {
  create(data: TCreateGroupData): Promise<IGroup | void>
  find(data: TFindGroupData): Promise<IGroup[] | void>
  findByName(data: TFindGroupByNameData): Promise<IGroup[] | void>
  update(data: TUpdateGroupData): Promise<IGroup | void>
  updateParticipants(data: TUpdateGroupParticipantsData): Promise<{
    clientsEntering: IClient[]
    clientsLeaving: IClient[]
    updatedGroup: IGroup
  } | void>
  updateMany(data: TUpdateGroupData): Promise<number | void>
  delete(data: TFindGroupData): Promise<IGroup | void>
}
