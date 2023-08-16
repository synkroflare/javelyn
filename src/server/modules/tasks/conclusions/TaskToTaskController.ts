import { Task, Lead, PrismaClient } from "@prisma/client"
import { Request, Response } from "express"
import { JavelynResponse } from "server/modules/leads/CreateLeadController"
import { container, inject, injectable } from "tsyringe"

type TRequest = {
  task: {
    where: {}
    data: Task
    include?: any
    skip?: any
    take?: any
  }
  newTask: {
    data: any
    include?: any
    skip?: any
    take?: any
  }
}

export class TaskToTaskController {
  async handle(request: Request, response: Response): Promise<Response> {
    try {
      const data = request.body
      const taskToTaskUseCase = container.resolve(TaskToTaskUseCase)
      const taskToTask = await taskToTaskUseCase.execute(data)

      return response.status(201).json(taskToTask)
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
export class TaskToTaskUseCase {
  constructor(
    @inject("PrismaClient")
    private readonly client: PrismaClient
  ) {}

  async execute(data: TRequest): Promise<JavelynResponse> {
    if (!data.task || !data.newTask)
      throw new Error("Erro: dados insuficientes.")
    const task = this.client.task.update(data.task)
    const newTask = this.client.task.create(data.newTask)

    this.client.$transaction([task, newTask])

    return {
      meta: {
        message: "A tarefa foi convertida para um nova tarefa.",
        status: 200,
      },
      objects: [{ task }, { newTask }],
    }
  }
}
