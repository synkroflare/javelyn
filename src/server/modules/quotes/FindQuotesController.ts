import { PrismaClient, Quote } from "@prisma/client"
import { Request, Response } from "express"
import { container, inject, injectable } from "tsyringe"

type TFindQuotesData = {
  where: {}
  include?: {}
  skip?: number
  take?: number
}

export class FindQuotesController {
  async handle(request: Request, response: Response): Promise<Response> {
    try {
      const data = request.body
      const findQuoteUseCase = container.resolve(FindQuotesUseCase)
      const foundQuotes = await findQuoteUseCase.execute(data)

      return response.status(201).json(foundQuotes)
    } catch (error: any) {
      return response.status(400).send(error.message)
    }
  }
}

@injectable()
export class FindQuotesUseCase {
  constructor(
    @inject("PrismaClient")
    private readonly client: PrismaClient
  ) {}

  async execute(data: TFindQuotesData): Promise<Quote[] | void> {
    const foundQuotes = await this.client.quote.findMany(data)
    return foundQuotes
  }
}
