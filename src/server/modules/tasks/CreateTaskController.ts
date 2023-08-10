import { PrismaClient, Task } from "@prisma/client"
import { Request, Response } from "express"
import { container, inject, injectable } from "tsyringe"
import { toUSVString } from "util"
import { JavelynResponse } from "../leads/CreateLeadController"

type TCreateTaskData = {
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

export class CreateTaskController {
  async handle(request: Request, response: Response): Promise<Response> {
    try {
      const data = request.body
      const createTaskUseCase = container.resolve(CreateTaskUseCase)
      const createTask = await createTaskUseCase.execute(data)

      return response.status(201).json(createTask)
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
export class CreateTaskUseCase {
  constructor(
    @inject("PrismaClient")
    private readonly client: PrismaClient
  ) {}

  async execute(data: TCreateTaskData): Promise<JavelynResponse> {
    const createTask = await this.client.task.create(data)
    return {
      meta: {
        message: "Task criada com sucesso.",
        status: 200,
      },
      objects: [createTask],
    }
  }
}
