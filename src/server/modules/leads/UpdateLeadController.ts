import { PrismaClient, Lead } from "@prisma/client"
import { Request, Response } from "express"
import { container, inject, injectable } from "tsyringe"

type TRequest = {
  where: {}
  data: {}
  include?: any
  skip?: any
  take?: any
}

export class UpdateLeadController {
  async handle(request: Request, response: Response): Promise<Response> {
    try {
      const data = request.body
      const updateLeadUseCase = container.resolve(UpdateLeadUseCase)
      const updateLead = await updateLeadUseCase.execute(data)

      return response.status(201).json(updateLead)
    } catch (error: any) {
      return response.status(400).send(error.message)
    }
  }
}

@injectable()
export class UpdateLeadUseCase {
  constructor(
    @inject("PrismaClient")
    private readonly client: PrismaClient
  ) {}

  async execute(data: TRequest): Promise<Lead | void> {
    const updateLead = await this.client.lead.update(data)
    return updateLead
  }
}
