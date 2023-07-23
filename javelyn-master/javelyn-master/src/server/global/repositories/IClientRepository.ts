import { Client } from "@prisma/client"
import { IClient } from "../models/IClient"

export type TCreateClientData = {
  name: string
  phone?: string
  mail?: string
  rank?: number
  age?: number
  companyId: number
}

export type TFindClientData = {
  id?: number
  name?: string
  phone?: string
  mail?: string
  rank?: number
  companyId: number
}

export type TFindClientByNameData = {
  name: string
  companyId: number
}

export type TUpdateClientData = {
  id?: number
  name?: string
  phone?: string | null
  mail?: string
  rank?: number
  companyId: number
}

export type THandleActiveStatusData = {
  treshold: number
  companyId: number
}

export type THomeCheckData = {
  companyId: number
}

export interface IClientRepository {
  homeCheck(data: THomeCheckData): Promise<any>
  create(data: TCreateClientData): Promise<Client | void>
  find(data: TFindClientData): Promise<Client[] | void>
  findWithFilters(data: any): Promise<Client[] | void>
  findByName(data: TFindClientByNameData): Promise<Client[] | void>
  update(data: TUpdateClientData): Promise<Client | void>
  updateMany(data: TUpdateClientData): Promise<number | void>
  delete(data: TFindClientData): Promise<Client | void>
  handleActiveStatus(data: THandleActiveStatusData): Promise<Client[] | void>
  updateClientProcedureType(data: TFindClientData): Promise<Client[] | void>
}
