import { Client } from "@prisma/client"
import { Request, Response } from "express"
import { container, inject, injectable } from "tsyringe"
import {
  IClientRepository,
  TUpdateClientData,
} from "../../global/repositories/IClientRepository"

export class UpdateClientController {
  async handle(request: Request, response: Response): Promise<Response> {
    try {
      const data = request.body
      const updateClientUseCase = container.resolve(UpdateClientUseCase)
      const updateClient = await updateClientUseCase.execute(data)

      const jsonClient = JSON.stringify(
        updateClient,
        (key, value) => (typeof value === "bigint" ? Number(value) : value) // return everything else unchanged
      )

      return response.status(201).send(jsonClient)
    } catch (error: any) {
      return response.status(400).send(error.message)
    }
  }
}

@injectable()
export class UpdateClientUseCase {
  constructor(
    @inject("ClientRepository")
    private clientRepository: IClientRepository
  ) {}

  async execute(data: TUpdateClientData): Promise<Client | void> {
    const updateClient = await this.clientRepository.update(data)
    return updateClient
  }
}
