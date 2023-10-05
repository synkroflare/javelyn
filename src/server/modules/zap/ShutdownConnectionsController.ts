import { PrismaClient } from "@prisma/client"
import { Request, Response } from "express"
import { container, inject, injectable } from "tsyringe"
import WAWebJS, { Client } from "whatsapp-web.js"
import {
  IZapRepository,
  THandleConnectionData,
} from "../../global/repositories/IZapRepository"
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
      console.log("shutting down zapClient-" + user.id)
      if (!container.isRegistered("zapClient-" + user.id)) continue
      const zapClient = container.resolve<Client>("zapClient-" + user.id)
      if (!zapClient.pupPage || zapClient.pupPage.isClosed()) {
        console.log("skiping zapClient-" + user.id)
      }
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
