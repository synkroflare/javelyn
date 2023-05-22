import { IClient } from "../models/IClient"

export type TSendMessageData = {
  phoneNumbers: number[]
  clientsData: IClient[]
  message: string
  companyId: number
  userId: number
}

export type THandleConnectionData = {
  companyId: number
  userId: number
}

export interface IZapRepository {
  sendMessage(data: TSendMessageData): Promise<string>
  handleConnection(
    data: THandleConnectionData
  ): Promise<{ isConnected: boolean; qrCode: string }>
}
