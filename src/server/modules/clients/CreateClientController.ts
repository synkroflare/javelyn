import { Request, Response } from "express"
import { container, inject, injectable } from "tsyringe"
import { IClient } from "../../global/models/IClient"
import { IClientRepository } from "../../global/repositories/IClientRepository"

type TRequest = {
  name: string
  phone: number
  mail: string
  rank: number
  companyId: number
}

export class CreateClientController {
  async handle(request: Request, response: Response): Promise<Response> {
    try {
      const data = request.body
      const createClientUseCase = container.resolve(CreateClientUseCase)
      const createClient = await createClientUseCase.execute(data)

      return response.status(201).json(createClient)
    } catch (error: any) {
      return response.status(400).send(error.message)
    }
  }
}

@injectable()
export class CreateClientUseCase {
  constructor(
    @inject("ClientRepository")
    private clientRepository: IClientRepository
  ) {}

  async execute(data: TRequest): Promise<IClient | void> {
    data.name = data.name.toUpperCase()
    const createClient = await this.clientRepository.create(data)
    return createClient
  }
}
