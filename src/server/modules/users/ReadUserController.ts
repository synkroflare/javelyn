import { Request, Response } from "express"
import { container, inject, injectable } from "tsyringe"
import { IUser } from "../../global/models/IUser"
import { IUserRepository } from "../../global/repositories/IUserRepository"

type TRequest = {
  id?: number
  companyId: number
}

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
    @inject("UserRepository")
    private userRepository: IUserRepository
  ) {}

  async execute(data: TRequest): Promise<IUser[] | void> {
    const readUser = await this.userRepository.find(data)
    return readUser
  }
}
