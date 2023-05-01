import { Request, Response } from "express"
import { container, inject, injectable } from "tsyringe"
import { IUser } from "../../global/models/IUser"
import { IUserRepository } from "../../global/repositories/IUserRepository"

type TRequest = {
  username: string
  password: string
  permission: string
  name: string
  companyId: number
}

export class CreateUserController {
  async handle(request: Request, response: Response): Promise<Response> {
    try {
      const data = request.body
      const createUserUseCase = container.resolve(CreateUserUseCase)
      const createUser = await createUserUseCase.execute(data)

      return response.status(201).json(createUser)
    } catch (error: any) {
      return response.status(400).send(error.message)
    }
  }
}

@injectable()
export class CreateUserUseCase {
  constructor(
    @inject("UserRepository")
    private userRepository: IUserRepository
  ) {}

  async execute(data: TRequest): Promise<IUser | void> {
    const createUser = await this.userRepository.create(data)
    return createUser
  }
}
