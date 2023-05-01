import { Prisma, PrismaClient } from "@prisma/client"
import { inject, injectable } from "tsyringe"
import { IList } from "../../models/IList"
import {
  IListRepository,
  TCreateListData,
  TFindListByNameData,
  TFindListData,
  TUpdateListData,
} from "../IListRepository"

@injectable()
export class ListFunctionsRepository implements IListRepository {
  constructor(
    @inject("PrismaClient")
    private readonly client: PrismaClient
  ) {}

  async update(data: TUpdateListData): Promise<void | IList> {
    const list: any = await this.client.list.update(data)
    const clients: any[] = list.pendingClients

    if (clients && clients.length === 0) {
      await this.client.list.update({
        where: {
          id: data.where.id,
        },
        data: {
          statusTrashed: true,
        },
      })
    }

    return list
  }
  async updateMany(data: TUpdateListData): Promise<Prisma.BatchPayload | void> {
    const lists = await this.client.list.updateMany(data)

    return lists
  }

  async delete(data: TFindListData): Promise<void | IList> {
    const list = await this.client.list.update({
      where: {
        id: data.id,
      },
      data: {
        statusTrashed: true,
      },
    })

    return list
  }

  async create(data: TCreateListData): Promise<IList | void> {
    const list = await this.client.list.create({ data })
    return list
  }

  async find(data: TFindListData): Promise<IList[] | void> {
    const formatedData: any = { ...data }
    delete formatedData.javelynThrowsDates

    const lists = await this.client.list.findMany({
      where: formatedData,
      include: {
        pendingClients: true,
        sentClients: true,
      },
    })
    return lists
  }

  async findByName(data: TFindListByNameData): Promise<IList[] | void> {
    const lists = await this.client.list.findMany({
      where: {
        statusTrashed: false,
      },
    })

    const filteredLists: IList[] = []

    for (let i = 0; i < lists.length; i++) {
      if (lists[i].name.includes(data.name)) {
        filteredLists.push(lists[i])
      }
    }

    return filteredLists
  }
}
