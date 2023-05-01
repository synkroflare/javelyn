import { Request, Response } from "express"
import { container, inject, injectable } from "tsyringe"
import { IUser } from "../../global/models/IUser"
import { IUserRepository } from "../../global/repositories/IUserRepository"

type TRequest = {
  id?: number
  companyId: number
  name: string
}

export class FindUserByNameController {
  async handle(request: Request, response: Response): Promise<Response> {
    try {
      const data = request.body
      const findUserUseCase = container.resolve(FindUserByNameUseCase)
      const findUser = await findUserUseCase.execute(data)

      return response.status(201).json(findUser)
    } catch (error: any) {
      return response.status(400).send(error.message)
    }
  }
}

@injectable()
export class FindUserByNameUseCase {
  constructor(
    @inject("UserRepository")
    private userRepository: IUserRepository
  ) {}

  async execute(data: TRequest): Promise<IUser[] | void> {
    const findUser = await this.userRepository.findByName(data)
    return findUser
  }
}
