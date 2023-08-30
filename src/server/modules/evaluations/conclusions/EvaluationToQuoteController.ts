import { PrismaClient, Task, Evaluation } from "@prisma/client"
import { Request, Response } from "express"
import { JavelynResponse } from "server/modules/leads/CreateLeadController"
import { container, inject, injectable } from "tsyringe"

type TRequest = {
  evaluation: {
    where: Evaluation
    data: Evaluation
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

export class EvaluationToQuoteController {
  async handle(request: Request, response: Response): Promise<Response> {
    try {
      const data = request.body
      const evaluationToQuoteUseCase = container.resolve(
        EvaluationToQuoteUseCase
      )
      const evaluationToQuote = await evaluationToQuoteUseCase.execute(data)

      return response.status(201).json(evaluationToQuote)
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
export class EvaluationToQuoteUseCase {
  constructor(
    @inject("PrismaClient")
    private readonly client: PrismaClient
  ) {}

  async execute(data: TRequest): Promise<JavelynResponse> {
    if (!data.evaluation?.data?.id || !data.quote || !data.newTask)
      throw new Error("Erro: dados insuficientes.")

    const quote = await this.client.quote.create(data.quote)
    const evaluation = this.client.evaluation.update({
      where: {
        id: data.evaluation.data.id,
      },
      data: {
        statusAccomplished: true,
        handledAtDate: new Date(),
        conclusionCategory: data.evaluation.data.conclusionCategory,
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

    const objects = await this.client.$transaction([evaluation, newTask])

    return {
      meta: {
        message: "A tarefa foi convertida para um novo orçamento.",
        status: 200,
      },
      objects: [...objects, quote],
    }
  }
}
