import { Task } from "@prisma/client"
import { Request, Response } from "express"
import { container, inject, injectable } from "tsyringe"
import { ITaskRepository } from "../../global/repositories/ITaskRepository"

type TRequest = {
  type: string
  taskId: number
  id: number
  companyId: number
}

export class DeleteTaskController {
  async handle(request: Request, response: Response): Promise<Response> {
    try {
      const data = request.body
      const deleteTaskUseCase = container.resolve(DeleteTaskUseCase)
      const deleteTask = await deleteTaskUseCase.execute(data)

      return response.status(201).json(deleteTask)
    } catch (error: any) {
      return response.status(400).send(error.message)
    }
  }
}

@injectable()
export class DeleteTaskUseCase {
  constructor(
    @inject("TaskRepository")
    private taskRepository: ITaskRepository
  ) {}

  async execute(data: TRequest): Promise<Task | void> {
    const deleteTask = await this.taskRepository.delete(data)
    return deleteTask
  }
}
