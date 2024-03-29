import { Quote, Lead, PrismaClient, Task } from "@prisma/client"
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
  quote: {
    data: any
    include?: any
    skip?: any
    take?: any
  }
  newTask: {
    where: {}
    data: Task
    include?: any
    skip?: any
    take?: any
  }
}

export class TaskToQuoteController {
  async handle(request: Request, response: Response): Promise<Response> {
    try {
      const data = request.body
      const taskToQuoteUseCase = container.resolve(TaskToQuoteUseCase)
      const taskToQuote = await taskToQuoteUseCase.execute(data)

      return response.status(201).json(taskToQuote)
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
export class TaskToQuoteUseCase {
  constructor(
    @inject("PrismaClient")
    private readonly client: PrismaClient
  ) {}

  async execute(data: TRequest): Promise<JavelynResponse> {
    if (!data.task?.data?.id || !data.quote || !data.newTask)
      throw new Error("Erro: dados insuficientes.")

    const quote = await this.client.quote.create(data.quote)
    const task = this.client.task.update({
      where: {
        id: data.task.data.id,
      },
      data: {
        statusHandled: true,
        handledAtDate: new Date(),
        conclusionCategory: data.task.data.conclusionCategory,
      },
    })
    const newTask = this.client.task.create({
      data: {
        ...data.newTask.data,
        quotes: {
          connect: [
            {
              id: quote.id,
            },
          ],
        },
      },
    })

    const objects = await this.client.$transaction([task, newTask])

    return {
      meta: {
        message: "A tarefa foi convertida para um novo orçamento.",
        status: 200,
      },
      objects: [...objects, quote],
    }
  }
}
