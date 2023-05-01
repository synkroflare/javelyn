import { Request, Response } from "express"
import { container, inject, injectable } from "tsyringe"
import { IUser } from "../../global/models/IUser"
import { IUserRepository } from "../../global/repositories/IUserRepository"

type TRequest = {
  type: string
  userId: number
  id: number
  companyId: number
}

export class UpdateUserController {
  async handle(request: Request, response: Response): Promise<Response> {
    try {
      const data = request.body
      const updateUserUseCase = container.resolve(UpdateUserUseCase)
      const updateUser = await updateUserUseCase.execute(data)

      return response.status(201).json(updateUser)
    } catch (error: any) {
      return response.status(400).send(error.message)
    }
  }
}

@injectable()
export class UpdateUserUseCase {
  constructor(
    @inject("UserRepository")
    private userRepository: IUserRepository
  ) {}

  async execute(data: TRequest): Promise<IUser | void> {
    const updateUser = await this.userRepository.update(data)
    return updateUser
  }
}
