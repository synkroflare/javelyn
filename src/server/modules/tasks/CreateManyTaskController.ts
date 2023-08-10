import { PrismaClient, Task } from "@prisma/client"
import { Request, Response } from "express"
import { container, inject, injectable } from "tsyringe"
import { JavelynResponse } from "../leads/CreateLeadController"

type TCreateManyTaskData = {
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

export class CreateManyTaskController {
  async handle(request: Request, response: Response): Promise<Response> {
    try {
      const data = request.body
      const createManyTaskUseCase = container.resolve(CreateManyTaskUseCase)
      const createManyTask = await createManyTaskUseCase.execute(data)

      return response.status(201).json(createManyTask)
    } catch (error: any) {
      return response.status(400).send({
        meta: {
          message: error.message,
          status: 400,
        },
        objects: null,
      })
    }
  }
}

@injectable()
export class CreateManyTaskUseCase {
  constructor(
    @inject("PrismaClient")
    private readonly client: PrismaClient
  ) {}

  async execute(data: any): Promise<JavelynResponse> {
    const createManyTask = await this.client.task.createMany(data)
    return {
      meta: {
        message: "Tasks criadas com sucesso.",
        status: 200,
      },
      objects: [{ count: createManyTask.count }],
    }
  }
}
