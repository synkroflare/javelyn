import { PrismaClient, User } from "@prisma/client"
import { Request, Response } from "express"
import { container, inject, injectable } from "tsyringe"

export class ReadUserController {
  async handle(request: Request, response: Response): Promise<Response> {
    try {
      const data = request.body
      const readUserUseCase = container.resolve(ReadUserUseCase)
      const readUser = await readUserUseCase.execute(data)

      return response.status(201).json(readUser)
    } catch (error: any) {
      return response.status(400).send(error.message)
    }
  }
}

@injectable()
export class ReadUserUseCase {
  constructor(
    @inject("PrismaClient")
    private client: PrismaClient
  ) {}

  async execute(data: any): Promise<User | null> {
    const readUser = await this.client.user.findFirst(data)
    return readUser
  }
}
