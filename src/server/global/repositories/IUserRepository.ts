import { IUser } from "../models/IUser"

export type TCreateUserData = {
  username: string
  password: string
  name: string
  permission: string
  companyId: number
}

export type TFindUserData = {
  id?: number
  companyId: number
}

export type TFindUserByNameData = {
  name: string
  companyId: number
}

export type TUpdateUserData = {
  id: number
  companyId: number
}

export interface IUserRepository {
  create(data: TCreateUserData): Promise<IUser | void>
  find(data: TFindUserData): Promise<IUser[] | void>
  findByName(data: TFindUserByNameData): Promise<IUser[] | void>
  update(data: TUpdateUserData): Promise<IUser | void>
  updateMany(data: TUpdateUserData): Promise<number | void>
  delete(data: TFindUserData): Promise<IUser | void>
}
