import { PrismaClient, Lead } from "@prisma/client"
import { Request, Response } from "express"
import { container, inject, injectable } from "tsyringe"

type TFindLeadsData = {
  where: {}
  include?: {}
  skip?: number
  take?: number
}

export class FindLeadsController {
  async handle(request: Request, response: Response): Promise<Response> {
    try {
      const data = request.body
      const findLeadUseCase = container.resolve(FindLeadsUseCase)
      const foundLeads = await findLeadUseCase.execute(data)

      return response.status(201).json(foundLeads)
    } catch (error: any) {
      return response.status(400).send(error.message)
    }
  }
}

@injectable()
export class FindLeadsUseCase {
  constructor(
    @inject("PrismaClient")
    private readonly client: PrismaClient
  ) {}

  async execute(data: TFindLeadsData): Promise<Lead[] | void> {
    const foundLeads = await this.client.lead.findMany(data)

    return foundLeads
  }
}
