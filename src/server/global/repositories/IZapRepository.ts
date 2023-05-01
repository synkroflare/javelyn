import { IClient } from "../models/IClient"

export type TSendMessageData = {
  phoneNumbers: number[]
  clientsData: IClient[]
  message: string
}

export type TGetQRCodeData = {
  companyId: number
}

export interface IZapRepository {
  sendMessage(data: TSendMessageData): Promise<string>
  getQRCode(data: TGetQRCodeData): Promise<string>
}
