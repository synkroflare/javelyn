import { PrismaClient, Lead } from "@prisma/client"
import { Request, Response } from "express"
import { container, inject, injectable } from "tsyringe"
import { toUSVString } from "util"

type TCreateLeadData = {
  data: {
    body: string
    companyId: number
    targetDate: Date
    title: string
    creatorId: number
    targets: {
      connect: any
    }
  }
  include: {
    targets?: any
    creatorUser?: any
  }
}

export class CreateLeadController {
  async handle(request: Request, response: Response): Promise<Response> {
    try {
      const data = request.body
      const createLeadUseCase = container.resolve(CreateLeadUseCase)
      const createLead = await createLeadUseCase.execute(data)

      return response.status(201).json(createLead)
    } catch (error: any) {
      return response.status(400).send(error.message)
    }
  }
}

@injectable()
export class CreateLeadUseCase {
  constructor(
    @inject("PrismaClient")
    private readonly client: PrismaClient
  ) {}

  async execute(data: TCreateLeadData): Promise<Lead | void> {
    const string = ""
    const createLead = await this.client.lead.create(data)
    return createLead
  }
}
