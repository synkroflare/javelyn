import { Request, Response } from "express"
import { container, inject, injectable } from "tsyringe"
import { IClient } from "../../global/models/IClient"
import { IClientRepository } from "../../global/repositories/IClientRepository"

type TRequest = {
  type: string
  userId: number
  id: number
}

export class DeleteClientController {
  async handle(request: Request, response: Response): Promise<Response> {
    try {
      const data = request.body
      const deleteClientUseCase = container.resolve(DeleteClientUseCase)
      const deleteClient = await deleteClientUseCase.execute(data)

      return response.status(201).json(deleteClient)
    } catch (error: any) {
      return response.status(400).send(error.message)
    }
  }
}

@injectable()
export class DeleteClientUseCase {
  constructor(
    @inject("ClientRepository")
    private clientRepository: IClientRepository
  ) {}

  async execute(data: TRequest): Promise<IClient | void> {
    const deleteClient = await this.clientRepository.delete(data)
    return deleteClient
  }
}
