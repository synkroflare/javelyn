import { PrismaClient, Quote } from "@prisma/client"
import { Request, Response } from "express"
import { container, inject, injectable } from "tsyringe"

type TUpdateManyQuoteData = {
  where: any
  data: {}
  include?: any
  skip?: any
  take?: any
}

export class UpdateManyQuoteController {
  async handle(request: Request, response: Response): Promise<Response> {
    try {
      const data = request.body
      const updateQuoteUseCase = container.resolve(UpdateManyQuoteUseCase)
      const updateQuotes = await updateQuoteUseCase.execute(data)

      return response.status(201).json(updateQuotes)
    } catch (error: any) {
      return response.status(400).send(error.message)
    }
  }
}

@injectable()
export class UpdateManyQuoteUseCase {
  constructor(
    @inject("PrismaClient")
    private readonly client: PrismaClient
  ) {}

  async execute(data: TUpdateManyQuoteData): Promise<number> {
    if (!data.where || Object.keys(data).length === 0) {
      console.error(
        "CANCELED ACTION: Trying to updateMany quotes without a WHERE clause."
      )
      return 0
    }
    const updateQuotes = await this.client.quote.updateMany(data)

    return updateQuotes.count
  }
}
