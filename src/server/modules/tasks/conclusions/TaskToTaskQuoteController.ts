import { Task, PrismaClient, Quote } from "@prisma/client"
import { Request, Response } from "express"
import { getDaysDifference } from "../../../../server/global/repositories/implementations/helpers/getDaysDifference"
import { JavelynResponse } from "server/modules/leads/CreateLeadController"
import { container, inject, injectable } from "tsyringe"

type TRequest = {
  task: {
    where: {}
    data: Task
    include: {
      quotes: {
        include: {
          tasks: true
        }
      }
    } & any
    skip?: any
    take?: any
  }
}

export class TaskToTaskQuoteController {
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
    if (!data.task) throw new Error("Erro: dados insuficientes.")
    const task = await this.client.task.update(data.task)

    const quote = task.quotes[0] as Quote & {
      tasks: Task[]
    }

    if (!quote) throw new Error("ERRO: Orçamento não encontrado.")

    const dayDifference = getDaysDifference(
      new Date(),
      new Date(task.quotes[0])
    )

    if (dayDifference > 30)
      return {
        meta: {
          message:
            "O orçamento expirou. Nenhuma task será gerada automaticamente.",
          status: 300,
        },
        objects: [{ task }, { quote }],
      }

    if (quote.tasks?.length >= 5)
      return {
        meta: {
          message:
            "Este orçamento atingiu o limite de 5 tasks. Nenhuma task será gerada automaticamente.",
          status: 300,
        },
        objects: [{ task }, { quote: task.quotes[0] }],
      }

    const newTask = await this.client.task.create({
      data: {
        title: `RECONTATO: ${task.title}`,
        body: task.body,
        category: "ORÇAMENTO",
        companyId: task.companyId,
        creatorId: task.creatorId,
        targetDate: new Date(),
        quotes: {
          connect: {
            id: quote.id,
          },
        },
      },
    })

    return {
      meta: {
        message: "A tarefa foi convertida para um nova tarefa.",
        status: 200,
      },
      objects: [{ task }, { newTask }],
    }
  }
}
