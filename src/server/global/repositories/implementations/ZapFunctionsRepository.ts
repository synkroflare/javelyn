import { PrismaClient } from "@prisma/client"
import { container, inject, injectable } from "tsyringe"
import { Client, LocalAuth, NoAuth } from "whatsapp-web.js"
import {
  IZapRepository,
  THandleConnectionData,
  TSendMessageData,
} from "../IZapRepository"

@injectable()
export class ZapFunctionsRepository implements IZapRepository {
  constructor(
    @inject("PrismaClient")
    private readonly prismaClient: PrismaClient
  ) {}

  async sendMessage(data: TSendMessageData): Promise<string> {
    try {
      const zapClient = container.resolve<Client>("zapClient-" + data.userId)
      const status = await zapClient.getState()
      if (status === null) {
        return "No connection"
      }

      console.log({ cdata: data.clientsData })

      if (!data.clientsData || data.clientsData.length === 0) {
        if (data.phoneNumbers) {
          for (let i = 0; i < data.phoneNumbers.length; i++) {
            if (data.phoneNumbers[i].toString().length < 8) {
              console.log("Invalid phone number: " + data.phoneNumbers[i])
              continue
            }
            zapClient.sendMessage(
              `55${data.phoneNumbers[i]}@c.us`,
              data.message
            )
            console.log(
              "Sending message with no cdata to: " + data.phoneNumbers[i]
            )
            await new Promise((resolve) => setTimeout(resolve, 1000)) ///// WAITS FOR 1 SECOND TO PREVENT WHATSAPP BUG FOR SENDING TOO MANY MSGS
          }
          return "Message sent successfully, without client data."
        }
        return "No client data provided."
      }

      for (let i = 0; i < data.clientsData.length; i++) {
        if (
          !data.clientsData[i].phone ||
          typeof data.clientsData[i].phone !== "string"
        ) {
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

        if (data.clientsData[i].phone!.length < 8) {
          console.log("Invalid phone number: " + data.phoneNumbers[i])
          continue
        }

        zapClient.sendMessage(`55${data.clientsData[i].phone}@c.us`, format1)
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
        await new Promise((resolve) => setTimeout(resolve, 1000)) ///// WAITS FOR 1 SECOND TO PREVENT WHATSAPP BUG FOR SENDING TOO MANY MSGS
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

  async handleConnection(
    data: THandleConnectionData
  ): Promise<{ isConnected: boolean; qrCode: string }> {
    console.log({ data })
    const user = await this.prismaClient.user.findFirst({
      where: {
        id: data.userId,
        companyId: data.companyId,
      },
    })

    if (!user)
      return {
        isConnected: false,
        qrCode: "",
      }

    const check = container.isRegistered<Client | string>(
      "zapClient-" + user.id
    )
    const clientCheck = check
      ? container.resolve("zapClient-" + user.id)
      : undefined

    console.log({ check })
    console.log({ clientCheck })

    if (!check || clientCheck === "disconnected") {
      const client = new Client({
        authStrategy: new LocalAuth({ clientId: "zapClient-" + user.id }),
        puppeteer: {
          args: ["--no-sandbox"],
        },
      })
      container.registerInstance<Client>("zapClient-" + user.id, client)
      client.initialize()
      client.on("loading_screen", (percent, message) => {
        console.log(
          "zapClient-" + user.id + " LOADING SCREEN",
          percent,
          message
        )
      })

      /* const qrCode: string = await new Promise((resolve, reject) => {
        client.on("qr", async (qr) => {
          console.log("zapClient-" + user.id + " qr on")
          await this.prismaClient.user.update({
            where: {
              id: data.userId,
            },
            data: {
              zapQrcode: qr,
            },
          })
          resolve(qr)
        })
      }) */

      client.on("qr", async (qr) => {
        console.log("zapClient-" + user.id + " qr on")
        await this.prismaClient.user.update({
          where: {
            id: data.userId,
          },
          data: {
            zapQrcode: qr,
          },
        })
      })

      client.on("authenticated", () => {
        console.log("zapClient-" + user.id + " AUTHENTICATED")
      })
      client.on("auth_failure", (msg) => {
        // Fired if session restore was unsuccessful
        console.error("zapClient-" + user.id + " AUTHENTICATION FAILURE", msg)
      })
      client.on("ready", () => {
        console.log("zapClient-" + user.id + " READY")
      })

      client.on("disconnected", () => {
        console.log("zapClient-" + user.id + " disconnected.")
        container.registerInstance<string>(
          "zapClient-" + user.id,
          "disconnected"
        )
      })

      return {
        isConnected: false,
        qrCode: user.zapQrcode,
      }
    }

    return {
      isConnected: true,
      qrCode: user.zapQrcode,
    }
  }
}
