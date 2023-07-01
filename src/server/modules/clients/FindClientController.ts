import { PrismaClient } from "@prisma/client"
import { Request, Response } from "express"
import { container, inject, injectable } from "tsyringe"
import { IClient } from "../../global/models/IClient"

export class FindClientController {
  async handle(request: Request, response: Response): Promise<Response> {
    try {
      const data = request.body
      const findClientUseCase = container.resolve(FindClientUseCase)
      const findClient = await findClientUseCase.execute(data)

      const jsonClient = JSON.stringify(
        findClient,
        (key, value) => (typeof value === "bigint" ? Number(value) : value) // return everything else unchanged
      )

      return response.status(201).send(jsonClient)
    } catch (error: any) {
      return response.status(400).send(error.message)
    }
  }
}

@injectable()
export class FindClientUseCase {
  constructor(
    @inject("PrismaClient")
    private prismaClient: PrismaClient
  ) {}

  async execute(data: any): Promise<IClient[] | void> {
    const findClient = await this.prismaClient.client.findMany(data)
    return findClient
  }
}
