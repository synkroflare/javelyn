import { PrismaClient, Quote } from "@prisma/client"
import { Request, Response } from "express"
import { container, inject, injectable } from "tsyringe"

type TCreateQuoteData = {
  data: any
  include?: {}
}

export class CreateQuoteController {
  async handle(request: Request, response: Response): Promise<Response> {
    try {
      const data = request.body
      const createQuoteUseCase = container.resolve(CreateQuoteUseCase)
      const createQuote = await createQuoteUseCase.execute(data)

      return response.status(201).json(createQuote)
    } catch (error: any) {
      return response.status(400).send(error.message)
    }
  }
}

@injectable()
export class CreateQuoteUseCase {
  constructor(
    @inject("PrismaClient")
    private readonly client: PrismaClient
  ) {}

  async execute(data: TCreateQuoteData): Promise<Quote | void> {
    const createQuote = await this.client.quote.create(data)
    return createQuote
  }
}
