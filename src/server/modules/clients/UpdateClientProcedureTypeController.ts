import { Client } from "@prisma/client"
import { Request, Response } from "express"
import { container, inject, injectable } from "tsyringe"
import { IClient } from "../../global/models/IClient"
import { IClientRepository } from "../../global/repositories/IClientRepository"

type TRequest = {
  treshold: number
  companyId: number
}

export class UpdateClientProcedureTypeController {
  async handle(request: Request, response: Response): Promise<Response> {
    try {
      const data = request.body
      const updateClientProcedureType = container.resolve(
        UpdateClientProcedureType
      )
      const updateClientType = await updateClientProcedureType.execute(data)

      const jsonClient = JSON.stringify(
        updateClientType,
        (key, value) => (typeof value === "bigint" ? Number(value) : value) // return everything else unchanged
      )

      return response.status(201).send(jsonClient)
    } catch (error: any) {
      return response.status(400).send(error.message)
    }
  }
}

@injectable()
export class UpdateClientProcedureType {
  constructor(
    @inject("ClientRepository")
    private clientRepository: IClientRepository
  ) {}

  async execute(data: TRequest): Promise<Client[] | void> {
    const readClient = await this.clientRepository.updateClientProcedureType(
      data
    )
    return readClient
  }
}
