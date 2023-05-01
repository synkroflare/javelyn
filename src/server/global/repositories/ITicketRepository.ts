import { ITicket } from "../models/ITicket"

export type TCreateTicketData = {
  type: string
  creatorUserId: number
  assignedUserId: number | undefined
  permitedUserIds: number[]
  procedureName: string
  clientId: number
  clientName: string
  companyId: number
  value: number

  returnDate: Date | undefined
  assignedDate: Date | undefined
  postponedDate: Date | undefined

  statusPostponed: boolean
  statusDone: boolean
  statusCanceled: boolean
  statusTrashed: boolean
}

export type TFindTicketData = {
  id?: number
  companyId: number
}

export type TFindTicketWithFiltersData = {
  value: any
}

export type TUpdateTicketData = {
  id: number
  companyId: number
}

export interface ITicketRepository {
  create(data: TCreateTicketData): Promise<ITicket | void>
  find(data: TFindTicketData): Promise<ITicket[] | void>
  findWithFilters(data: any): Promise<ITicket[] | void>
  update(data: TUpdateTicketData): Promise<ITicket | void>
  updateMany(data: TUpdateTicketData): Promise<number | void>
  delete(data: TFindTicketData): Promise<ITicket | void>
}
