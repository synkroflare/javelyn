import { PrismaClient, Lead } from "@prisma/client"
import { Request, Response } from "express"
import { container, inject, injectable } from "tsyringe"

type TUpdateManyLeadData = {
  where: {}
  data: {}
  include?: any
  skip?: any
  take?: any
}

export class UpdateManyLeadController {
  async handle(request: Request, response: Response): Promise<Response> {
    try {
      const data = request.body
      const updateLeadUseCase = container.resolve(UpdateManyLeadUseCase)
      const updateLeads = await updateLeadUseCase.execute(data)

      return response.status(201).json(updateLeads)
    } catch (error: any) {
      return response.status(400).send(error.message)
    }
  }
}

@injectable()
export class UpdateManyLeadUseCase {
  constructor(
    @inject("PrismaClient")
    private readonly client: PrismaClient
  ) {}

  async execute(data: TUpdateManyLeadData): Promise<number> {
    if (!data.where || Object.keys(data).length === 0) {
      console.error(
        "CANCELED ACTION: Trying to updateMany quotes without a WHERE clause."
      )
      return 0
    }

    const updateLeads = await this.client.lead.updateMany(data)
    return updateLeads.count
  }
}
