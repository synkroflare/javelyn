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

export class DeleteUserController {
  async handle(request: Request, response: Response): Promise<Response> {
    try {
      const data = request.body
      const deleteUserUseCase = container.resolve(DeleteUserUseCase)
      const deleteUser = await deleteUserUseCase.execute(data)

      return response.status(201).json(deleteUser)
    } catch (error: any) {
      return response.status(400).send(error.message)
    }
  }
}

@injectable()
export class DeleteUserUseCase {
  constructor(
    @inject("UserRepository")
    private userRepository: IUserRepository
  ) {}

  async execute(data: TRequest): Promise<IUser | void> {
    const deleteUser = await this.userRepository.delete(data)
    return deleteUser
  }
}
