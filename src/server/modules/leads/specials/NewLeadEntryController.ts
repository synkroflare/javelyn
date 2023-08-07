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

export class NewLeadEntryController {
  async handle(request: Request, response: Response): Promise<Response> {
    try {
      const data = request.body
      const head = request.params
      console.log({ head })
      const newLeadEntryUseCase = container.resolve(NewLeadEntryUseCase)
      const newLeadEntry = await newLeadEntryUseCase.execute(data)

      return response.status(201).json(newLeadEntry)
    } catch (error: any) {
      return response.status(400).send({
        meta: {
          status: 400,
          message: error.message,
        },
        objects: null,
      })
    }
  }
}

@injectable()
export class NewLeadEntryUseCase {
  constructor(
    @inject("PrismaClient")
    private readonly client: PrismaClient
  ) {}

  async execute(inputData: any): Promise<JavelynResponse | void> {
    const { data } = inputData
    if (!data.name || !data.phone || !data.companyId)
      throw new Error("ERRO: Não foi provido nome/telefone corretamente.")
    const lead = await this.client.lead.findUnique({
      where: {
        companyId_name_phone: {
          name: data.name,
          phone: data.phone,
          companyId: data.companyId,
        },
      },
    })
    if (!lead) throw new Error("ERRO: nenhum lead encontrado.")
    const javelynEntryDates = [...lead.javelynEntryDates, data.newEntry]
    const updatedLead = await this.client.lead.update({
      where: {
        id: lead.id,
      },
      data: {
        javelynEntryDates,
      },
    })
    return {
      meta: {
        status: 200,
        message: "Uma nova entrada foi registrada para o lead.",
      },
      objects: [updatedLead],
    }
  }
}
