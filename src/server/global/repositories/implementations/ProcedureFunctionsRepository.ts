import { PrismaClient } from "@prisma/client"
import { inject, injectable } from "tsyringe"
import { IProcedure } from "../../models/IProcedure"
import {
  IProcedureRepository,
  TCreateProcedureData,
  TFindProcedureByNameData,
  TFindProcedureData,
  TUpdateProcedureData,
} from "../IProcedureRepository"

@injectable()
export class ProcedureFunctionsRepository implements IProcedureRepository {
  constructor(
    @inject("PrismaClient")
    private readonly client: PrismaClient
  ) {}
  async update(data: TUpdateProcedureData): Promise<void | IProcedure> {
    const formatedData = {
      ...data,
    }

    console.log(data)

    data.id ? (formatedData.id = Number(data.id)) : null
    data.value && data.value !== "null"
      ? (formatedData.value = Number(data.value))
      : (formatedData.value = null)

    data.recommendedReturnTime
      ? (formatedData.recommendedReturnTime = Number(
          data.recommendedReturnTime
        ))
      : null

    const procedures = await this.client.procedure.update({
      where: {
        id: formatedData.id,
      },
      data: formatedData,
    })

    return procedures
  }
  async updateMany(data: TUpdateProcedureData): Promise<number | void> {
    const procedures = await this.client.procedure.updateMany({
      where: {
        id: data.id,
      },
      data,
    })

    return procedures.count
  }

  async delete(data: TFindProcedureData): Promise<void | IProcedure> {
    const procedure = await this.client.procedure.update({
      where: {
        id: data.id,
      },
      data: {
        statusTrashed: true,
      },
    })

    return procedure
  }

  async create(data: TCreateProcedureData): Promise<IProcedure | void> {
    const procedure = await this.client.procedure.create({ data })
    return procedure
  }

  async find(data: TFindProcedureData): Promise<IProcedure[] | void> {
    const procedures = await this.client.procedure.findMany({
      where: data,
    })
    return procedures
  }
  async findByName(
    data: TFindProcedureByNameData
  ): Promise<IProcedure[] | void> {
    const procedures = await this.client.procedure.findMany({
      where: {
        statusTrashed: false,
      },
    })

    const filteredUsers: IProcedure[] = []

    for (let i = 0; i < procedures.length; i++) {
      if (procedures[i].name.includes(data.name)) {
        filteredUsers.push(procedures[i])
      }
    }

    return filteredUsers
  }

  async findWithFilters(inputData: any): Promise<IProcedure[] | void> {
    const formatedData: any = {}
    const specialFilters: any = {
      ticketCount: {
        enabled: false,
        value: null,
      },
    }
    const data = inputData.filters

    for (let i = 0; i < data.length; i++) {
      if (data[i].value && data[i].type && data[i].comparator) {
        if (data[i].type === "ticketCount") {
          specialFilters.ticketCount.enabled = true
          specialFilters.ticketCount.comparator = data[i].comparator
          specialFilters.ticketCount.value = Number(data[i].value)
          continue
        }
        if (data[i].type === "value") {
          formatedData[data[i].type] = {
            [data[i].comparator]: Number(data[i].value),
          }
          continue
        }
        if (data[i].type === "statusActive") {
          formatedData.statusActive = {
            [data[i].comparator]: data[i].value === "true" ? true : false,
          }
          continue
        }
        formatedData[data[i].type] = {
          [data[i].comparator]: data[i].value,
        }
      }
    }

    formatedData.companyId = inputData.companyId

    console.log({ formatedData })

    let procedures = await this.client.procedure.findMany({
      where: formatedData,
      include: {
        ticket: true,
        company: true,
      },
    })

    if (specialFilters.ticketCount.enabled) {
      switch (specialFilters.ticketCount.comparator) {
        case "equals":
          procedures = procedures.filter(
            (c) => c.ticket.length == specialFilters.ticketCount.value
          )
          break
        case "not":
          procedures = procedures.filter(
            (c) => c.ticket.length != specialFilters.ticketCount.value
          )
          break
        case "gt":
          procedures = procedures.filter(
            (c) => c.ticket.length > specialFilters.ticketCount.value
          )
          break
        case "lt":
          procedures = procedures.filter(
            (c) => c.ticket.length < specialFilters.ticketCount.value
          )
          break
      }
    }
    return procedures
  }
}
