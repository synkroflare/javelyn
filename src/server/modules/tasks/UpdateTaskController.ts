import { PrismaClient, Task } from "@prisma/client"
import { Request, Response } from "express"
import { container, inject, injectable } from "tsyringe"

type TRequest = {
  where: {}
  data: {}
  include?: any
  skip?: any
  take?: any
}

export class UpdateTaskController {
  async handle(request: Request, response: Response): Promise<Response> {
    try {
      const data = request.body
      const updateTaskUseCase = container.resolve(UpdateTaskUseCase)
      const updateTask = await updateTaskUseCase.execute(data)

      return response.status(201).json(updateTask)
    } catch (error: any) {
      return response.status(400).send(error.message)
    }
  }
}

@injectable()
export class UpdateTaskUseCase {
  constructor(
    @inject("PrismaClient")
    private readonly client: PrismaClient
  ) {}

  async execute(data: TRequest): Promise<Task | void> {
    const updateTask = await this.client.task.update(data)
    return updateTask
  }
}
