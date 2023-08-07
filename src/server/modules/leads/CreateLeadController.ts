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
      if (!data.phone) {
        const findLeadWithoutPhone = await this.client.lead.findFirst({
          where: {
            name: data.name,
            companyId: data.companyId,
          },
        })
        if (findLeadWithoutPhone) {
          return {
            meta: {
              status: 400,
              message: `Já existe um lead cadastrado sem telefone e com este nome.`,
            },
            objects: null,
          }
        }
      }
      const findLead = await this.client.lead.findUnique({
        where: {
          companyId_name_phone: {
            companyId: data.companyId,
            name: data.name,
            phone: data.phone,
          },
        },
      })
      if (findLead) {
        return {
          meta: {
            status: 301,
            message: `Já existe um lead cadastrado com este nome e telefone.`,
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
