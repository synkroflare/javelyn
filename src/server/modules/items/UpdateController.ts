import { PrismaClient, Item } from "@prisma/client"
import { Request, Response } from "express"
import { container, inject, injectable } from "tsyringe"

type TRequest = {
  where: {}
  data: {}
  include?: any
  skip?: any
  take?: any
}

export class UpdateItemController {
  async handle(request: Request, response: Response): Promise<Response> {
    try {
      const data = request.body
      const updateItemUseCase = container.resolve(UpdateItemUseCase)
      const updateItem = await updateItemUseCase.execute(data)

      return response.status(201).json({
        meta: {
          status: 200,
          message: "O item foi atualizado com sucesso.",
        },
        objects: [updateItem],
      })
    } catch (error: any) {
      return response.status(400).send(error.message)
    }
  }
}

@injectable()
export class UpdateItemUseCase {
  constructor(
    @inject("PrismaClient")
    private readonly client: PrismaClient
  ) {}

  async execute(data: TRequest): Promise<Item | void> {
    const updateItem = await this.client.item.update(data)
    return updateItem
  }
}
