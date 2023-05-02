import { PrismaClient } from "@prisma/client"
import { inject, injectable } from "tsyringe"
import { Client } from "whatsapp-web.js"
import {
  IZapRepository,
  TGetQRCodeData,
  TSendMessageData,
} from "../IZapRepository"

@injectable()
export class ZapFunctionsRepository implements IZapRepository {
  constructor(
    @inject("ZapClient")
    private readonly zapClient: Client,
    @inject("PrismaClient")
    private readonly prismaClient: PrismaClient
  ) {}

  async sendMessage(data: TSendMessageData): Promise<string> {
    try {
      const status = await this.zapClient.getState()
      if (status === null) {
        return "No connection"
      }

      console.log({ cdata: data.clientsData })

      if (!data.clientsData || data.clientsData.length === 0) {
        if (data.phoneNumbers) {
          for (let i = 0; i < data.phoneNumbers.length; i++) {
            this.zapClient.sendMessage(
              `55${data.phoneNumbers[i]}@c.us`,
              data.message
            )
            console.log(
              "Sending message with no cdata to: " + data.phoneNumbers[i]
            )
          }
          return "Message sent successfully, without client data."
        }
        return "No client data provided."
      }

      for (let i = 0; i < data.clientsData.length; i++) {
        if (!data.clientsData[i].phone) {
          console.log(
            "No phone provided for client: " + data.clientsData[i].name
          )
          continue
        }
        const name = data.clientsData[i].name.split(" ")[0].toLowerCase()
        const formatedName = name.charAt(0).toUpperCase() + name.slice(1)
        const format1 = data.message.replace("$[NOME]", formatedName)
        const format2 = format1.replace(
          "$[LINK CADASTRO]",
          "http://localhost:3000/register?id=" +
            data.clientsData[i].id +
            "&uuid=" +
            data.clientsData[i].uuid
        )

        this.zapClient.sendMessage(
          `55${data.clientsData[i].phone}@c.us`,
          format1
        )
        console.log("Sending message to: " + data.clientsData[i].phone)
        try {
          await this.prismaClient.throw.create({
            data: {
              companyId: data.companyId,
              targetsIds: [data.clientsData[i].id],
              creatorId: data.userId,
              body: data.message,
            },
          })
        } catch (e: any) {
          console.log(e.message)
        }
      }

      const clientIds = data.clientsData.map((client) => client.id)
      const todayDate = new Date()

      await this.prismaClient.client.updateMany({
        where: {
          id: {
            in: clientIds,
          },
        },
        data: {
          javelynContactAttemptsDates: {
            push: todayDate,
          },
        },
      })

      return "messages sent successfully"
    } catch (error: any) {
      return error.message
    }
  }

  async getQRCode(data: TGetQRCodeData): Promise<string> {
    const company = await this.prismaClient.company.findFirst({
      where: {
        id: data.companyId,
      },
    })

    if (!company || !company.zapQrcode) {
      return "no qrcode found"
    }

    return company?.zapQrcode
  }
}
