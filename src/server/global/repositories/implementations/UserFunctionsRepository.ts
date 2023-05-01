import { PrismaClient } from "@prisma/client"
import { inject, injectable } from "tsyringe"
import { IUser } from "../../models/IUser"
import {
  IUserRepository,
  TCreateUserData,
  TFindUserByNameData,
  TFindUserData,
  TUpdateUserData,
} from "../IUserRepository"

@injectable()
export class UserFunctionsRepository implements IUserRepository {
  constructor(
    @inject("PrismaClient")
    private readonly client: PrismaClient
  ) {}
  async update(data: TUpdateUserData): Promise<void | IUser> {
    const users = await this.client.user.update({
      where: {
        id: data.id,
      },
      data,
    })

    return users
  }
  async updateMany(data: TUpdateUserData): Promise<number | void> {
    const users = await this.client.user.updateMany({
      where: {
        id: data.id,
      },
      data,
    })

    return users.count
  }

  async delete(data: TFindUserData): Promise<void | IUser> {
    const user = await this.client.user.update({
      where: {
        id: data.id,
      },
      data: {
        statusTrashed: true,
      },
    })

    return user
  }

  async create(data: TCreateUserData): Promise<IUser | void> {
    const user = await this.client.user.create({ data })
    return user
  }

  async find(data: TFindUserData): Promise<IUser[] | void> {
    const user = await this.client.user.findMany({
      where: data,
      include: {
        createdTickets: true,
        assignedTickets: true,
        company: true,
      },
    })

    if (!user) return []

    return user
  }

  async findByName(data: TFindUserByNameData): Promise<IUser[] | void> {
    const users = await this.client.user.findMany({
      where: {
        statusTrashed: false,
      },
    })

    const filteredUsers: IUser[] = []

    for (let i = 0; i < users.length; i++) {
      if (users[i].name.includes(data.name)) {
        filteredUsers.push(users[i])
      }
    }

    return filteredUsers
  }
}
