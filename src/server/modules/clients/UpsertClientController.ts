import { PrismaClient } from "@prisma/client"
import { Request, Response } from "express"
import { container, inject, injectable } from "tsyringe"
import {} from "../../global/repositories/IClientRepository"
import { JavelynResponse } from "../leads/CreateLeadController"

export class UpsertClientController {
  async handle(request: Request, response: Response): Promise<Response> {
    try {
      const data = request.body
      const upsertClientUseCase = container.resolve(UpsertClientUseCase)
      const upsertClient = await upsertClientUseCase.execute(data)

      return response.status(201).send(upsertClient)
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
export class UpsertClientUseCase {
  constructor(
    @inject("PrismaClient")
    private client: PrismaClient
  ) {}

  async execute(data: any): Promise<JavelynResponse> {
    const upsertClient = await this.client.client.upsert(data)
    return {
      meta: {
        status: 200,
        message: "Sucesso",
      },
      objects: [upsertClient],
    }
  }
}
