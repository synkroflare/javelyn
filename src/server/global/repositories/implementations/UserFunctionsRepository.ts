import { PrismaClient, User } from "@prisma/client";
import { inject, injectable } from "tsyringe";
import {
  IUserRepository,
  TCreateUserData,
  TFindUserByNameData,
  TFindUserData,
  TUpdateUserData,
} from "../IUserRepository";

@injectable()
export class UserFunctionsRepository implements IUserRepository {
  constructor(
    @inject("PrismaClient")
    private readonly client: PrismaClient
  ) {}
  async update(data: TUpdateUserData): Promise<void | User> {
    const users = await this.client.user.update({
      where: {
        id: data.id,
      },
      data,
    });

    return users;
  }
  async updateMany(data: TUpdateUserData): Promise<number | void> {
    const users = await this.client.user.updateMany({
      where: {
        id: data.id,
      },
      data,
    });

    return users.count;
  }

  async delete(data: TFindUserData): Promise<void | User> {
    const user = await this.client.user.update({
      where: {
        id: data.id,
      },
      data: {
        statusTrashed: true,
      },
    });

    return user;
  }

  async create(data: TCreateUserData): Promise<User | void> {
    const user = await this.client.user.create({ data });
    return user;
  }

  async find(data: TFindUserData): Promise<User[] | void> {
    const user = await this.client.user.findMany({
      where: data,
      include: {
        role: true,
      },
    });

    if (!user) return [];

    return user;
  }

  async findByName(data: TFindUserByNameData): Promise<User[] | void> {
    const users = await this.client.user.findMany({
      where: {
        statusTrashed: false,
      },
    });

    const filteredUsers: User[] = [];

    for (let i = 0; i < users.length; i++) {
      if (users[i].name.includes(data.name)) {
        filteredUsers.push(users[i]);
      }
    }

    return filteredUsers;
  }
}
