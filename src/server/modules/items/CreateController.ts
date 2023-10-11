import { PrismaClient, Item } from "@prisma/client"
import { Request, Response } from "express"
import { container, inject, injectable } from "tsyringe"

export type JavelynResponse = {
  meta: {
    status: number
    message: string
  }
  objects: any
}

export class CreateItemController {
  async handle(request: Request, response: Response): Promise<Response> {
    try {
      const data = request.body
      const createItemUseCase = container.resolve(CreateItemUseCase)
      const createItem = await createItemUseCase.execute(data)

      return response.status(200).json(createItem)
    } catch (error: any) {
      return response.status(400).send({
        meta: {
          status: 400,
          message: error.message,
        },
        objects: null,
      })
    }
  }
}

@injectable()
export class CreateItemUseCase {
  constructor(
    @inject("PrismaClient")
    private readonly client: PrismaClient
  ) {}

  async execute(data: any): Promise<JavelynResponse | void> {
    const createItem = await this.client.item.create(data)
    return {
      meta: {
        status: 200,
        message: "O item foi criado com sucesso.",
      },
      objects: [createItem],
    }
  }
}
