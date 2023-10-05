import { PrismaClient } from "@prisma/client"
import { Request, Response } from "express"
import { container, inject, injectable } from "tsyringe"
import WAWebJS, { Client } from "whatsapp-web.js"
import fs from "fs"
import { JavelynResponse } from "../leads/CreateLeadController"

export class ShutdownConnectionsController {
  async handle(request: Request, response: Response): Promise<Response> {
    try {
      const data = request.body
      const shutdownConnectionUseCase = container.resolve(
        ShutdownConnectionsUseCase
      )
      const shutdownConnection = await shutdownConnectionUseCase.execute(data)

      return response.status(201).json(shutdownConnection)
    } catch (error: any) {
      return response.status(400).send(error.message)
    }
  }
}

@injectable()
export class ShutdownConnectionsUseCase {
  constructor(
    @inject("PrismaClient")
    private client: PrismaClient
  ) {}

  async execute(data: any): Promise<JavelynResponse> {
    if (!data?.where?.id)
      return {
        meta: {
          status: 400,
          message: "ERRO: Dados insuficientes.",
        },
        objects: null,
      }
    const company = await this.client.company.findFirst({
      where: {
        id: data.where.id,
      },
      include: {
        users: true,
      },
    })

    if (!company)
      return {
        meta: {
          status: 400,
          message: "ERRO: não foi possível encontrar 'company'.",
        },
        objects: null,
      }

    for (const user of company.users) {
      const directoryPath =
        "../../../../.wwebjs_auth/session-zapClient-" + user.id

      console.log({ directoryPath })

      if (fs.existsSync(directoryPath)) {
        try {
          fs.rmdirSync(directoryPath)
        } catch (err) {
          console.error("Erro ao excluir a pasta:", err)
        }
      }

      if (!container.isRegistered("zapClient-" + user.id)) continue
      const zapClient = container.resolve<Client>("zapClient-" + user.id)
      const clientState = await zapClient.getState()

      console.log(`zapclient-${user.id} |||| state: ${clientState}`)
      console.log(zapClient.info)
      if (!zapClient.pupPage || zapClient.pupPage.isClosed() || !clientState) {
        console.log("skiping zapClient-" + user.id)
        continue
      }
      console.log("shutting down zapClient-" + user.id)
      await zapClient.destroy()
      container.registerInstance<string>("zapClient-" + user.id, "disconnected")
    }

    await this.client.company.update({
      where: {
        id: company.id,
      },
      data: {
        whatsappFreeSlots: company.whatsappSlots,
      },
    })

    return {
      meta: {
        status: 200,
        message: "Todas as conexões foram encerradas.",
      },
      objects: null,
    }
  }
}
