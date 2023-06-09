import { PrismaClient } from "@prisma/client"
import { randomUUID } from "crypto"
import { inject, injectable } from "tsyringe"
import { IClient } from "../../models/IClient"
import {
  IClientRepository,
  TCreateClientData,
  TFindClientByNameData,
  TFindClientData,
  THandleActiveStatusData,
  THomeCheckData,
  TUpdateClientData,
} from "../IClientRepository"
import { filterClientsWithoutDate } from "./helpers/clientFilterHelpers/filterClientsWithoutDate"
import { verifyClientActiveStatus } from "./helpers/verifyClientActiveStatus"
import { verifyTicketReturnDates } from "./helpers/verifyTicketReturnDates"

@injectable()
export class ClientFunctionsRepository implements IClientRepository {
  constructor(
    @inject("PrismaClient")
    private readonly client: PrismaClient
  ) {}

  async update(data: TUpdateClientData): Promise<void | IClient> {
    console.log(data)
    const client = await this.client.client.update({
      where: {
        id: data.id,
      },
      data,
    })

    return client
  }
  async updateMany(data: TUpdateClientData): Promise<number | void> {
    const clients = await this.client.client.updateMany({
      where: {
        id: data.id,
      },
      data,
    })

    return clients.count
  }

  async delete(data: TFindClientData): Promise<void | IClient> {
    const client = await this.client.client.update({
      where: {
        id: data.id,
      },
      data: {
        statusTrashed: true,
      },
    })

    return client
  }

  async create(data: TCreateClientData): Promise<IClient | void> {
    const client = await this.client.client.create({ data })
    return client
  }

  async find(data: TFindClientData): Promise<IClient[] | void> {
    if (data.id) {
      data.id = Number(data.id)
    }
    const clients = await this.client.client.findMany({
      where: data,
      include: {
        tickets: {
          include: {
            procedures: true,
          },
        },
      },
    })
    return clients
  }

  async handleActiveStatus(
    data: THandleActiveStatusData
  ): Promise<IClient[] | void> {
    const allClients = await this.client.client.findMany({
      where: {
        companyId: data.companyId,
        statusTrashed: false,
      },
      include: {
        tickets: true,
      },
    })

    const promiseArray: any = []

    for (const client of allClients) {
      const activeData = verifyClientActiveStatus(client, data.treshold)
      verifyTicketReturnDates(client, this.client)

      const updateData: any = {
        statusActive: activeData.isActive,
        daysSinceLastTicket: activeData.daysSinceLastTicket,
      }

      if (activeData.isActive !== client.statusActive) {
        if (activeData.isActive) {
          updateData.flexusEntryDates = [...client.flexusEntryDates, new Date()]
        }
        if (!activeData.isActive) {
          updateData.javelynEntryDates = [
            ...client.javelynEntryDates,
            new Date(),
          ]
        }
      }
      promiseArray.push(
        new Promise(async (resolve, reject) => {
          resolve(
            await this.client.client.update({
              where: {
                name: client.name,
              },
              data: updateData,
            })
          )
        })
      )
    }

    Promise.all(promiseArray)

    return allClients
  }

  async updateClientProcedureType(
    data: TFindClientData
  ): Promise<IClient[] | void> {
    const allClients = await this.client.client.findMany({
      where: {
        companyId: data.companyId,
        statusTrashed: false,
      },
      include: {
        tickets: {
          include: {
            procedures: true,
          },
        },
      },
    })

    for (const client of allClients) {
      const updateData: any = {
        procedureTypeInjetavelCount: 0,
        procedureTypeCorporalCount: 0,
        procedureTypeFacialCount: 0,
        procedureTotalCount: 0,
      }
      for (const ticket of client.tickets) {
        const types = ticket.procedures.map((a: any) => a.type)
        updateData.procedureTotalCount += types.length
        updateData.procedureTypeInjetavelCount += types.filter(
          (a: any) => a === "INJETAVEL"
        ).length
        updateData.procedureTypeCorporalCount += types.filter(
          (a: any) => a === "CORPORAL"
        ).length
        updateData.procedureTypeFacialCount += types.filter(
          (a: any) => a === "FACIAL"
        ).length
      }

      if (
        updateData.procedureTypeFacialCount >
        0.5 * updateData.procedureTotalCount
      ) {
        updateData.procedureType = "FACIAL"
      }
      if (
        updateData.procedureTypeCorporalCount >
        0.5 * updateData.procedureTotalCount
      ) {
        updateData.procedureType = "CORPORAL"
      }
      if (
        updateData.procedureTypeInjetavelCount >
        0.5 * updateData.procedureTotalCount
      ) {
        updateData.procedureType = "INJETAVEL"
      }
      const updateClient = await this.client.client.update({
        where: {
          name: client.name,
        },
        data: updateData,
      })
    }

    const allTickets = await this.client.ticket.findMany({
      where: {
        companyId: data.companyId,
        statusTrashed: false,
      },
      include: {
        procedures: true,
      },
    })

    for (const ticket of allTickets) {
      const updateData: any = {
        procedureTypeInjetavelCount: 0,
        procedureTypeCorporalCount: 0,
        procedureTypeFacialCount: 0,
        procedureTotalCount: 0,
      }

      const types = ticket.procedures.map((a: any) => a.type)
      updateData.procedureTotalCount += types.length
      updateData.procedureTypeInjetavelCount += types.filter(
        (a: any) => a === "INJETAVEL"
      ).length
      updateData.procedureTypeCorporalCount += types.filter(
        (a: any) => a === "CORPORAL"
      ).length
      updateData.procedureTypeFacialCount += types.filter(
        (a: any) => a === "FACIAL"
      ).length

      if (
        updateData.procedureTypeFacialCount >
        0.5 * updateData.procedureTotalCount
      ) {
        updateData.procedureType = "FACIAL"
      }
      if (
        updateData.procedureTypeCorporalCount >
        0.5 * updateData.procedureTotalCount
      ) {
        updateData.procedureType = "CORPORAL"
      }
      if (
        updateData.procedureTypeInjetavelCount >
        0.5 * updateData.procedureTotalCount
      ) {
        updateData.procedureType = "INJETAVEL"
      }
      const updateTicket = await this.client.ticket.update({
        where: {
          id: ticket.id,
        },
        data: updateData,
      })
    }

    return allClients
  }

  async findWithFilters(data: any): Promise<IClient[] | void> {
    console.log(data)

    const whereData = {
      companyId: data.companyId,
    }
    const filters = data.filters
    const numericFilters = ["totalSpent", "daysDiff", "procedureCount"]
    const specialFilters = [""]
    const dateAffectedFilters = [
      "totalSpent",
      "ticketCount",
      "findByProcedure",
      "javelynThrowCount",
    ]

    /*  if (
      filters
        .map((f) => f.type)
        .filter((value: any) => dateAffectedFilters.includes(value)) &&
      filters.filter((f) => ["daysDiff", "date"].includes(f.type)).length > 0
    ) {
      const clients = await filterClientsWithoutDate(data, this.client, true)
      return await filterClientsWithDate({
        inputData: data,
        prismaClient: this.client,
        preFilteredClients: clients,
      })
    } */

    return await filterClientsWithoutDate(data, this.client)
  }

  async findByName(data: TFindClientByNameData): Promise<IClient[] | void> {
    console.log("hh")
    const test = true
    if (test) {
      const clients = await this.client.client.findMany()

      for (const client of clients) {
        if (!client.uuid) {
          const uuid = randomUUID()
          await this.client.client.update({
            where: {
              id: client.id,
            },
            data: {
              uuid: uuid,
            },
          })
        }
      }
    }

    const clients = await this.client.client.findMany({
      where: {
        statusTrashed: false,
      },
    })

    const filteredClients: IClient[] = []

    for (let i = 0; i < clients.length; i++) {
      if (clients[i].name.includes(data.name)) {
        filteredClients.push(clients[i])
      }
    }

    return filteredClients
  }

  async homeCheck(data: THomeCheckData): Promise<any> {
    const clients = await this.client.client.findMany({
      where: {
        companyId: data.companyId,
        statusTrashed: false,
      },
    })

    const todayDate = new Date()

    const hbdData: any[] = []

    for (let i = -14; i < 14; i++) {
      const date = new Date(todayDate.getTime() + 24 * i * 3600000)
      const hbdClients = clients.filter((client) => {
        if (!client.birthday) return

        if (
          client.birthday.getMonth() === date.getMonth() &&
          client.birthday.getDate() === date.getDate()
        ) {
          return client
        }
      })
      hbdData.push({
        date: date,
        hbds: hbdClients,
      })
    }

    return hbdData
  }
}
