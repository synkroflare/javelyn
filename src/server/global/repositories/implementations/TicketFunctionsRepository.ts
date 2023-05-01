import { PrismaClient } from "@prisma/client"
import { inject, injectable } from "tsyringe"
import { ITicket } from "../../models/ITicket"
import {
  ITicketRepository,
  TCreateTicketData,
  TFindTicketData,
  TUpdateTicketData,
} from "../ITicketRepository"

@injectable()
export class TicketFunctionsRepository implements ITicketRepository {
  constructor(
    @inject("PrismaClient")
    private readonly client: PrismaClient
  ) {}
  async update(data: TUpdateTicketData): Promise<void | ITicket> {
    const tickets = await this.client.ticket.update({
      where: {
        id: data.id,
      },
      data,
    })

    return tickets
  }
  async updateMany(data: TUpdateTicketData): Promise<number | void> {
    const tickets = await this.client.ticket.updateMany({
      where: {
        id: data.id,
      },
      data,
    })

    return tickets.count
  }

  async delete(data: TFindTicketData): Promise<void | ITicket> {
    const ticket = await this.client.ticket.update({
      where: {
        id: data.id,
      },
      data: {
        statusTrashed: true,
      },
    })

    return ticket
  }

  async create(data: TCreateTicketData): Promise<ITicket | void> {
    const ticket = await this.client.ticket.create({ data })
    return ticket
  }

  async find(data: TFindTicketData): Promise<ITicket[] | void> {
    const tickets = await this.client.ticket.findMany({
      where: data,
      include: {
        procedures: true,
        client: true,
        creatorUser: true,
        assignedUser: true,
        company: true,
      },
    })
    return tickets
  }

  async findWithFilters(inputData: any): Promise<ITicket[] | void> {
    const usedFilterOperators: any = {}
    const formatedData: any = {
      OR: [],
      AND: [],
    }

    const data = inputData.filters

    for (let i = 0; i < data.length; i++) {
      if (data[i].value && data[i].type && data[i].comparator) {
        const procedureNames: string[] = []
        if (data[i].type === "procedure") {
          procedureNames.push(data[i].value)

          const fixComparator = () => {
            if (data[i].comparator === "equals") return "in"
            return "notIn"
          }
          formatedData.procedures = {
            some: {
              name: {
                [fixComparator()]: procedureNames,
              },
            },
          }

          continue
        }

        if (data[i].type === "doneDate") {
          const dateChecker = new Date()
          dateChecker.setDate(dateChecker.getDate() - Number(data[i].value))

          const fixComparator = () => {
            if (data[i].comparator === "gt") return "lt"
            if (data[i].comparator === "lt") return "gt"
            return data[i].comparator
          }

          formatedData["doneDate"] = {
            [fixComparator()]: dateChecker,
          }
          continue
        }

        if (data[i].type === "value") {
          switch (usedFilterOperators[data[i].type]) {
            case true:
              formatedData.OR.push({
                [data[i].type]: {
                  [data[i].comparator]: Number(data[i].value),
                },
              })
              delete formatedData.AND[data[i].type]
              break
            case false:
              formatedData.AND.push({
                [data[i].type]: {
                  [data[i].comparator]: Number(data[i].value),
                },
              })
              break
            default:
              formatedData.AND.push({
                [data[i].type]: {
                  [data[i].comparator]: Number(data[i].value),
                },
              })
              break
          }
          usedFilterOperators[data[i].type] = true
          continue
        }

        switch (usedFilterOperators[data[i].type]) {
          case true:
            formatedData.OR.push({
              [data[i].type]: {
                [data[i].comparator]: data[i].value,
              },
            })
            delete formatedData.AND[data[i].type]
            break
          case false:
            formatedData.AND.push({
              [data[i].type]: {
                [data[i].comparator]: data[i].value,
              },
            })
            break
          default:
            formatedData.AND.push({
              [data[i].type]: {
                [data[i].comparator]: data[i].value,
              },
            })
            break
        }
        usedFilterOperators[data[i].type] = true
      }
    }

    if (formatedData.OR.length === 0) {
      delete formatedData.OR
    }

    if (formatedData.AND.length === 0) {
      delete formatedData.AND
    }

    formatedData.companyId = inputData.companyId

    const tickets = await this.client.ticket.findMany({
      where: formatedData,

      include: {
        procedures: true,
        client: true,
        creatorUser: true,
        assignedUser: true,
        company: true,
      },
    })

    return tickets
  }
}
