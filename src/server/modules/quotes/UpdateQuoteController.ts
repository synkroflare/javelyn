import { PrismaClient, Quote } from "@prisma/client"
import { Request, Response } from "express"
import { container, inject, injectable } from "tsyringe"

export class UpdateQuoteController {
  async handle(request: Request, response: Response): Promise<Response> {
    try {
      const data = request.body
      const updateQuoteUseCase = container.resolve(UpdateQuoteUseCase)
      const updateQuote = await updateQuoteUseCase.execute(data)

      return response.status(201).json(updateQuote)
    } catch (error: any) {
      return response.status(400).send(error.message)
    }
  }
}

@injectable()
export class UpdateQuoteUseCase {
  constructor(
    @inject("PrismaClient")
    private readonly client: PrismaClient
  ) {}

  async execute(data: any): Promise<Quote | void> {
    const updateQuote = await this.client.quote.update(data)
    return updateQuote
  }
}
