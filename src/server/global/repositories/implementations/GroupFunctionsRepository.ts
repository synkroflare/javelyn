import { PrismaClient } from "@prisma/client"
import { IClient } from "../../../../server/global/models/IClient"
import { inject, injectable } from "tsyringe"
import { IGroup } from "../../models/IGroup"
import { IClientRepository } from "../IClientRepository"
import {
  IGroupRepository,
  TCreateGroupData,
  TFindGroupByNameData,
  TFindGroupData,
  TUpdateGroupData,
  TUpdateGroupParticipantsData,
} from "../IGroupRepository"

@injectable()
export class GroupFunctionsRepository implements IGroupRepository {
  constructor(
    @inject("PrismaClient")
    private readonly client: PrismaClient,
    @inject("ClientRepository")
    private clientRepository: IClientRepository
  ) {}
  async updateParticipants(data: TUpdateGroupParticipantsData): Promise<void | {
    clientsEntering: IClient[]
    clientsLeaving: IClient[]
    updatedGroup: IGroup
  }> {
    const group = await this.client.group.findFirst({
      where: {
        id: data.id,
        companyId: data.companyId,
      },
      include: {
        clients: true,
      },
    })

    if (!group) return

    const filterData = {
      companyId: data.companyId,
      filters: data.filters,
    }

    const filteredClients: any = await this.clientRepository.findWithFilters(
      filterData
    )

    if (!filteredClients) return

    for (let i = 0; i < filteredClients.length; i++) {
      delete filteredClients[i].tickets
    }

    if (data.mode === "AUTOMATIC") {
      const updatedGroup = await this.client.group.update({
        where: {
          id: data.id,
        },
        data: {
          clients: {
            set: filteredClients.map((c: IClient) => {
              return { id: c.id }
            }),
          },
        },
        include: {
          clients: true,
        },
      })
      const groupIds = group.clients.map((c: IClient) => c.id)
      const updatedGroupIds = updatedGroup.clients.map((c: IClient) => c.id)

      const clientsEnteringIds: number[] = []
      const clientsLeavingIds: number[] = []

      for (let id of groupIds) {
        if (updatedGroupIds.includes(id)) {
          continue
        }
        clientsLeavingIds.push(id)
      }
      for (let id of updatedGroupIds) {
        if (groupIds.includes(id)) {
          continue
        }
        clientsEnteringIds.push(id)
      }

      const clientsEntering = await this.client.client.findMany({
        where: {
          id: {
            in: clientsEnteringIds,
          },
        },
      })

      const clientsLeaving = await this.client.client.findMany({
        where: {
          id: {
            in: clientsLeavingIds,
          },
        },
      })
      return {
        clientsEntering,
        clientsLeaving,
        updatedGroup,
      }
    }

    return
  }
  async update(data: TUpdateGroupData): Promise<void | IGroup> {
    const groups = await this.client.group.update({
      where: {
        id: data.id,
      },
      data,
    })

    return groups
  }
  async updateMany(data: TUpdateGroupData): Promise<number | void> {
    const groups = await this.client.group.updateMany({
      where: {
        id: data.id,
      },
      data,
    })

    return groups.count
  }

  async delete(data: TFindGroupData): Promise<void | IGroup> {
    const group = await this.client.group.update({
      where: {
        id: data.id,
      },
      data: {
        statusTrashed: true,
      },
    })

    return group
  }

  async create(data: TCreateGroupData): Promise<IGroup | void> {
    const group = await this.client.group.create({ data })
    return group
  }

  async find(data: TFindGroupData): Promise<IGroup[] | void> {
    const formatedData: any = { ...data }
    delete formatedData.javelynThrowsDates

    const groups = await this.client.group.findMany({
      where: formatedData,
      include: {
        clients: true,
      },
    })
    return groups
  }

  async findByName(data: TFindGroupByNameData): Promise<IGroup[] | void> {
    const groups = await this.client.group.findMany({
      where: {
        statusTrashed: false,
      },
    })

    const filteredGroups: IGroup[] = []

    for (let i = 0; i < groups.length; i++) {
      if (groups[i].name.includes(data.name)) {
        filteredGroups.push(groups[i])
      }
    }

    return filteredGroups
  }
}
