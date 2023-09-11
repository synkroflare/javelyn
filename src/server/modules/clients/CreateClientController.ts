import { Client, PrismaClient } from "@prisma/client"
import { Request, Response } from "express"
import { container, inject, injectable } from "tsyringe"

type TRequest = {
  name: string
  phone: number
  mail: string
  rank: number
  companyId: number
}

export class CreateClientController {
  async handle(request: Request, response: Response): Promise<Response> {
    try {
      const data = request.body
      const createClientUseCase = container.resolve(CreateClientUseCase)
      const createClient = await createClientUseCase.execute(data)

      return response.status(201).json(createClient)
    } catch (error: any) {
      return response.status(400).send(error.message)
    }
  }
}

@injectable()
export class CreateClientUseCase {
  constructor(
    @inject("PrismaClient")
    private prismaClient: PrismaClient
  ) {}

  async execute(data: any): Promise<Client | void> {
    data.data.name = data.data.name.toUpperCase()
    const createClient = await this.prismaClient.client.create(data)
    return createClient
  }
}
