import { PrismaClient, Item } from "@prisma/client"
import { Request, Response } from "express"
import { container, inject, injectable } from "tsyringe"

type TReadItemsData = {
  where: {
    companyId: number
    OR: any[]
    AND: any[]
  }
  include?: {}
  skip?: number
  take?: number
}

export class ReadItemsController {
  async handle(request: Request, response: Response): Promise<Response> {
    try {
      const data = request.body
      const findItemUseCase = container.resolve(ReadItemsUseCase)
      const foundItems = await findItemUseCase.execute(data)

      return response.status(201).json({
        meta: {
          status: 200,
          message: "O item foi encontrado com sucesso.",
        },
        objects: [foundItems],
      })
    } catch (error: any) {
      return response.status(400).send(error.message)
    }
  }
}

@injectable()
export class ReadItemsUseCase {
  constructor(
    @inject("PrismaClient")
    private readonly client: PrismaClient
  ) {}

  async execute(data: TReadItemsData): Promise<Item | null> {
    return await this.client.item.findFirst(data)
  }
}
