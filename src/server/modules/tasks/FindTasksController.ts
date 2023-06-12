import { PrismaClient, Task } from "@prisma/client"
import { Request, Response } from "express"
import { container, inject, injectable } from "tsyringe"

type TFindTasksData = {
  where: {}
  include?: {}
  skip?: number
  take?: number
}

export class FindTasksController {
  async handle(request: Request, response: Response): Promise<Response> {
    try {
      const data = request.body
      const findTaskUseCase = container.resolve(FindTasksUseCase)
      const foundTasks = await findTaskUseCase.execute(data)

      return response.status(201).json(foundTasks)
    } catch (error: any) {
      return response.status(400).send(error.message)
    }
  }
}

@injectable()
export class FindTasksUseCase {
  constructor(
    @inject("PrismaClient")
    private readonly client: PrismaClient
  ) {}

  async execute(data: TFindTasksData): Promise<Task[] | void> {
    const foundTasks = await this.client.task.findMany(data)
    return foundTasks
  }
}
