import { PrismaClient, Task } from "@prisma/client"
import { Request, Response } from "express"
import { container, inject, injectable } from "tsyringe"
import { JavelynResponse } from "../leads/CreateLeadController"

type TRequest = {
  task: {
    where: Task
    data: Task
    include?: any
    skip?: any
    take?: any
  }
}

export class UpdateTaskController {
  async handle(request: Request, response: Response): Promise<Response> {
    try {
      const data = request.body
      const updateTaskUseCase = container.resolve(UpdateTaskUseCase)
      const updateTask = await updateTaskUseCase.execute(data)

      return response.status(201).json(updateTask)
    } catch (error: any) {
      return response.status(400).send({
        meta: {
          status: 200,
          message: error.message,
        },
        objects: null,
      })
    }
  }
}

@injectable()
export class UpdateTaskUseCase {
  constructor(
    @inject("PrismaClient")
    private readonly client: PrismaClient
  ) {}

  async execute(data: TRequest): Promise<JavelynResponse> {
    const updateTask = await this.client.task.update(data.task)
    return {
      meta: {
        status: 200,
        message: "Tarefa atualizada com sucesso.",
      },
      objects: [updateTask],
    }
  }
}
