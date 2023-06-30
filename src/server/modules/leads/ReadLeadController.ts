import { PrismaClient, Lead } from "@prisma/client"
import { Request, Response } from "express"
import { container, inject, injectable } from "tsyringe"

type TReadLeadData = {
  where: {}
  include?: {}
}

export class ReadLeadController {
  async handle(request: Request, response: Response): Promise<Response> {
    try {
      const data = request.body
      const readLeadUseCase = container.resolve(ReadLeadUseCase)
      const readLead = await readLeadUseCase.execute(data)

      return response.status(201).json(readLead)
    } catch (error: any) {
      return response.status(400).send(error.message)
    }
  }
}

@injectable()
export class ReadLeadUseCase {
  constructor(
    @inject("PrismaClient")
    private readonly client: PrismaClient
  ) {}

  async execute(data: TReadLeadData): Promise<Lead | null> {
    const readLead = await this.client.lead.findFirst(data)
    return readLead
  }
}
