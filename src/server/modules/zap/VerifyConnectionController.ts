import { PrismaClient } from "@prisma/client"
import { Request, Response } from "express"
import { container, inject, injectable } from "tsyringe"
import { Client } from "whatsapp-web.js"
import {
  IZapRepository,
  THandleConnectionData,
} from "../../global/repositories/IZapRepository"
import { JavelynResponse } from "../leads/CreateLeadController"

export class VerifyConnectionController {
  async handle(request: Request, response: Response): Promise<Response> {
    try {
      const data = request.body
      const verifyConnectionUseCase = container.resolve(VerifyConnectionUseCase)
      const verifyConnection = await verifyConnectionUseCase.execute(data)

      return response.status(201).json(verifyConnection)
    } catch (error: any) {
      return response.status(400).send({
        meta: {
          status: 400,
          message: error.message,
        },
        objects: null,
      })
    }
  }
}

@injectable()
export class VerifyConnectionUseCase {
  constructor(
    @inject("PrismaClient")
    private client: PrismaClient
  ) {}

  async execute(data: any): Promise<JavelynResponse> {
    if (!data?.where?.id) throw new Error("ERRO: Dados insuficientes.")

    const user = await this.client.user.findFirst({
      where: {
        id: data.where.id,
      },
    })
    if (!user) throw new Error("ERRO: não foi possível encontrar 'user'.")

    if (user.zapStatus === "disconnected")
      return {
        meta: {
          status: 200,
          message: "Não está conectado",
        },
        objects: null,
      }

    if (user.zapStatus === "connected")
      return {
        meta: {
          status: 200,
          message: "Está conectado",
        },
        objects: null,
      }

    if (user.zapStatus === "loading")
      return {
        meta: {
          status: 200,
          message: "Carregando dados.",
        },
        objects: null,
      }

    return {
      meta: {
        status: 400,
        message: `O status do cliente de whatsapp não é válido. ${user.zapStatus}`,
      },
      objects: null,
    }
  }
}
