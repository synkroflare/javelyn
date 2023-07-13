import { PrismaClient, Lead } from "@prisma/client"
import { Request, Response } from "express"
import { container, inject, injectable } from "tsyringe"

export type JavelynResponse = {
  meta: {
    status: number
    message: string
  }
  objects: any
}

export class CreateLeadController {
  async handle(request: Request, response: Response): Promise<Response> {
    try {
      const data = request.body
      const createLeadUseCase = container.resolve(CreateLeadUseCase)
      const createLead = await createLeadUseCase.execute(data)

      return response.status(201).json(createLead)
    } catch (error: any) {
      return response.status(400).send(error.message)
    }
  }
}

@injectable()
export class CreateLeadUseCase {
  constructor(
    @inject("PrismaClient")
    private readonly client: PrismaClient
  ) {}

  async execute(inputData: any): Promise<JavelynResponse | void> {
    const { data } = inputData
    if (data.name) {
      const findLead = await this.client.lead.findFirst({
        where: {
          name: data.name,
        },
      })
      if (findLead) {
        return {
          meta: {
            status: 400,
            message: `Já existe um lead cadastrado com este nome.`,
          },
          objects: null,
        }
      }
    }
    const createLead = await this.client.lead.create(inputData)
    return {
      meta: {
        status: 200,
        message: "O Lead foi criado com sucesso.",
      },
      objects: createLead,
    }
  }
}
