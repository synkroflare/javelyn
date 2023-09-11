import { PrismaClient } from "@prisma/client"
import { Request, Response } from "express"
import { container, inject, injectable } from "tsyringe"
import { JavelynResponse } from "../leads/CreateLeadController"

type TRequest = {
  id?: number
  companyId: number
}

export class ReadClientController {
  async handle(request: Request, response: Response): Promise<Response> {
    try {
      const data = request.body
      const readClientUseCase = container.resolve(ReadClientUseCase)
      const readClient = await readClientUseCase.execute(data)

      const jsonClient = JSON.stringify(
        readClient,
        (key, value) => (typeof value === "bigint" ? Number(value) : value) // return everything else unchanged
      )

      return response.status(201).send(jsonClient)
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
export class ReadClientUseCase {
  constructor(
    @inject("PrismaClient")
    private client: PrismaClient
  ) {}

  async execute(data: any): Promise<JavelynResponse> {
    const readClient = await this.client.client.findFirst(data)
    return {
      meta: {
        status: 200,
        message: "Cliente encontrado.",
      },
      objects: [readClient],
    }
  }
}
