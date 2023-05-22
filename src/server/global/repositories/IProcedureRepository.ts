import { IProcedure } from "../models/IProcedure"

export type TCreateProcedureData = {
  name: string
  value: number
  companyId: number
}

export type TFindProcedureData = {
  id?: number
  companyId: number
}

export type TFindProcedureByNameData = {
  name: string
  companyId: number
}

export type TUpdateProcedureData = {
  id: number
  companyId: number
  name: string
  type: string
  value: number | any
  recommendedReturnTime: number | null
}

export interface IProcedureRepository {
  create(data: TCreateProcedureData): Promise<IProcedure | void>
  find(data: TFindProcedureData): Promise<IProcedure[] | void>
  findWithFilters(data: any): Promise<IProcedure[] | void>
  findByName(data: TFindProcedureByNameData): Promise<IProcedure[] | void>
  update(data: TUpdateProcedureData): Promise<IProcedure | void>
  updateMany(data: TUpdateProcedureData): Promise<number | void>
  delete(data: TFindProcedureData): Promise<IProcedure | void>
}
