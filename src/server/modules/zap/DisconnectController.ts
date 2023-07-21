import { PrismaClient } from "@prisma/client"
import { Request, Response } from "express"
import { container, inject, injectable } from "tsyringe"
import { Client } from "whatsapp-web.js"
import {
  IZapRepository,
  THandleConnectionData,
} from "../../global/repositories/IZapRepository"
import { JavelynResponse } from "../leads/CreateLeadController"

export class DisconnectController {
  async handle(request: Request, response: Response): Promise<Response> {
    try {
      const data = request.body
      const disconnectUseCase = container.resolve(DisconnectUseCase)
      const disconnect = await disconnectUseCase.execute(data)

      return response.status(201).json(disconnect)
    } catch (error: any) {
      return response.status(400).send(error.message)
    }
  }
}

@injectable()
export class DisconnectUseCase {
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
    console.log(`${data.where.id} is disconecting`)
    const user = await this.client.user.findFirst({
      where: {
        id: data.where.id,
      },
      include: {
        company: true,
      },
    })

    if (!user)
      return {
        meta: {
          status: 400,
          message: "ERRO: não foi possível encontrar 'user'.",
        },
        objects: null,
      }

    if (!container.isRegistered("zapClient-" + user.id))
      return {
        meta: {
          status: 200,
          message: "Não está conectado.",
        },
        objects: null,
      }

    const zapClient = container.resolve<Client>("zapClient-" + user.id)
    if (!(await zapClient.getState()))
      return {
        meta: {
          status: 200,
          message: "Não está conectado.",
        },
        objects: null,
      }
    await zapClient.destroy()
    await this.client.company.update({
      where: {
        id: user.company.id,
      },
      data: {
        whatsappFreeSlots: {
          increment: 1,
        },
      },
    })
    return {
      meta: {
        status: 200,
        message: "Foi desconectado.",
      },
      objects: null,
    }
  }
}
