import { PrismaClient, Quote } from "@prisma/client"
import { Request, Response } from "express"
import { container, inject, injectable } from "tsyringe"

type TReadQuoteData = {
  where: {}
  include?: {}
}

export class ReadQuoteController {
  async handle(request: Request, response: Response): Promise<Response> {
    try {
      const data = request.body
      const readQuoteUseCase = container.resolve(ReadQuoteUseCase)
      const readQuote = await readQuoteUseCase.execute(data)

      return response.status(201).json(readQuote)
    } catch (error: any) {
      return response.status(400).send(error.message)
    }
  }
}

@injectable()
export class ReadQuoteUseCase {
  constructor(
    @inject("PrismaClient")
    private readonly client: PrismaClient
  ) {}

  async execute(data: TReadQuoteData): Promise<Quote | null> {
    const readQuote = await this.client.quote.findFirst(data)
    return readQuote
  }
}
