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
      include: {
        events: true,
      },
    })

    if (client.birthday && client.events.length < 10) {
      const eventPromises: any = []

      for (let i2 = 0; i2 < 30; i2++) {
        const bday = new Date(client.birthday)
        bday.setFullYear(2023 + i2)

        const newEventData = {
          name: `Aniversário de ${client.name}`,
          type: "BIRTHDAY",
          date: bday,
          dateDay: bday.getDate(),
          dateMonth: bday.getMonth() + 1,
          dateYear: bday.getFullYear(),
          companyId: client.companyId,
          targets: { connect: { id: client.id } },
        }
        const newEvent = this.client.event.create({
          data: newEventData,
        })

        eventPromises.push(newEvent)

        continue
      }
      Promise.all(eventPromises)
    }

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
        responsibleUser: true,
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

    await this.client.company.update({
      where: {
        id: data.companyId,
      },
      data: {
        activeClientTreshold: data.treshold,
      },
    })

    const promiseArray: any = []

    for (const client of allClients) {
      const activeData = verifyClientActiveStatus(client, data.treshold)
      verifyTicketReturnDates(client, this.client)

      const updateData: any = {
        statusActive: activeData.isActive,
        daysSinceLastTicket: activeData.daysSinceLastTicket,
        rankName: activeData.rankName,
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
                id: client.id,
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

    const promises: Promise<any>[] = []
    allClients.forEach(async (client) => {
      const promise = async () => {
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
            id: client.id,
          },
          data: updateData,
        })
      }
      promises.push(promise())
    })
    await Promise.all(promises)

    const allTickets = await this.client.ticket.findMany({
      where: {
        companyId: data.companyId,
        statusTrashed: false,
      },
      include: {
        procedures: true,
      },
    })

    const ticketPromises: Promise<any>[] = []
    allTickets.forEach((ticket) => {
      const promise = async () => {
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
      ticketPromises.push(promise())
    })

    await Promise.all(ticketPromises)

    return allClients
  }

  async findWithFilters(data: any): Promise<IClient[] | void> {
    console.log({ data })

    return await filterClientsWithoutDate(data, this.client)
  }

  async findByName(data: TFindClientByNameData): Promise<IClient[] | void> {
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
