import { PrismaClient, Task } from "@prisma/client"
import { Request, Response } from "express"
import { container, inject, injectable } from "tsyringe"

type TReadTaskData = {
  where: {}
  include?: {}
}

export class ReadTaskController {
  async handle(request: Request, response: Response): Promise<Response> {
    try {
      const data = request.body
      const readTaskUseCase = container.resolve(ReadTaskUseCase)
      const readTask = await readTaskUseCase.execute(data)

      return response.status(201).json(readTask)
    } catch (error: any) {
      return response.status(400).send(error.message)
    }
  }
}

@injectable()
export class ReadTaskUseCase {
  constructor(
    @inject("PrismaClient")
    private readonly client: PrismaClient
  ) {}

  async execute(data: TReadTaskData): Promise<Task | null> {
    const readTask = await this.client.task.findFirst(data)
    return readTask
  }
}
