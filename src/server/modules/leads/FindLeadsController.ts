import { PrismaClient, Lead } from "@prisma/client"
import { Request, Response } from "express"
import { container, inject, injectable } from "tsyringe"

type TFindLeadsData = {
  where: {
    companyId: number
    OR: any[]
    AND: any[]
  }
  include?: {}
  skip?: number
  take?: number
}

export class FindLeadsController {
  async handle(request: Request, response: Response): Promise<Response> {
    try {
      const data = request.body
      const findLeadUseCase = container.resolve(FindLeadsUseCase)
      const foundLeads = await findLeadUseCase.execute(data)

      return response.status(201).json(foundLeads)
    } catch (error: any) {
      return response.status(400).send(error.message)
    }
  }
}

@injectable()
export class FindLeadsUseCase {
  constructor(
    @inject("PrismaClient")
    private readonly client: PrismaClient
  ) {}

  async execute(data: TFindLeadsData): Promise<Lead[] | void> {
    const specialFilters = ["taskCount"]
    const usedSpecialFilters: object[] = []
    let updatedData = data
    console.log({ data })

    if (!data.where) return
    const ORKeys = data.where.OR?.map((filter: object) =>
      Object.keys(filter)
    ).flat()
    const ANDKeys = data.where.AND?.map((filter: object) =>
      Object.keys(filter)
    ).flat()
    for (const filter of specialFilters) {
      if ([Object.keys(data.where), ORKeys, ANDKeys].flat().includes(filter)) {
        const filterInWhereObjectOR = data.where.OR?.find(
          (f: any) => Object.keys(f).toString() === filter
        )
        const filterInWhereObjectAND = data.where.AND?.find(
          (f: any) => Object.keys(f).toString() === filter
        )
        console.log({ filterInWhereObjectOR, filterInWhereObjectAND })
        updatedData.where.OR = updatedData.where.OR.filter(
          (f: any) => f !== filterInWhereObjectOR
        )
        updatedData.where.AND = updatedData.where.AND.filter(
          (f: any) => f !== filterInWhereObjectAND
        )
        usedSpecialFilters.push(filterInWhereObjectOR ?? filterInWhereObjectAND)
      }
    }

    console.log(JSON.stringify({ updatedData }))

    let foundLeads = await this.client.lead.findMany(updatedData)

    if (usedSpecialFilters.length > 0) {
      for (const specialFilter of usedSpecialFilters) {
        console.log(
          JSON.stringify({
            specialFilter,
            keys: Object.keys(specialFilter),
            entries: Object.entries(
              Object.entries(specialFilter).flat()[1]
            )?.flat(),
            values: Object.values(specialFilter),
          })
        )
        const comparator = Object.entries(
          Object.entries(specialFilter).flat()[1]
        )?.flat()[0]
        const value = Number(
          Object.entries(Object.entries(specialFilter).flat()[1])?.flat()[1]
        )
        console.log({ value, comparator })
        if (isNaN(value)) continue
        if (Object.keys(specialFilter).toString() === "taskCount") {
          foundLeads = foundLeads.filter((lead: any) => {
            if (comparator === "gt" && lead.targetedTasks?.length > value)
              return lead
            if (comparator === "lt" && lead.targetedTasks?.length < value)
              return lead
            if (comparator === "equals" && lead.targetedTasks?.length === value)
              return lead
            if (comparator === "not" && lead.targetedTasks?.length !== value)
              return lead
          })
        }
      }
    }

    return foundLeads
  }
}
