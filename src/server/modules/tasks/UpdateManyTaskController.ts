import { PrismaClient, Task } from "@prisma/client"
import { Request, Response } from "express"
import { container, inject, injectable } from "tsyringe"

type TUpdateManyTaskData = {
  where: {}
  data: {}
  include?: any
  skip?: any
  take?: any
}

export class UpdateManyTaskController {
  async handle(request: Request, response: Response): Promise<Response> {
    try {
      const data = request.body
      const updateTaskUseCase = container.resolve(UpdateManyTaskUseCase)
      const updateTasks = await updateTaskUseCase.execute(data)

      return response.status(201).json(updateTasks)
    } catch (error: any) {
      return response.status(400).send(error.message)
    }
  }
}

@injectable()
export class UpdateManyTaskUseCase {
  constructor(
    @inject("PrismaClient")
    private readonly client: PrismaClient
  ) {}

  async execute(data: TUpdateManyTaskData): Promise<number> {
    const updateTasks = await this.client.task.updateMany(data)
    return updateTasks.count
  }
}
