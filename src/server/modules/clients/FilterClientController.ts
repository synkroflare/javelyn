import { Client } from "@prisma/client"
import { Request, Response } from "express"
import { container, inject, injectable } from "tsyringe"
import { IClientRepository } from "../../global/repositories/IClientRepository"

type TRequest = {
  id?: number
  companyId: number
}

export class FilterClientController {
  async handle(request: Request, response: Response): Promise<Response> {
    try {
      const data = request.body
      const readClientUseCase = container.resolve(FilterClientUseCase)
      const readClient = await readClientUseCase.execute(data)
      const jsonClient = JSON.stringify(
        readClient,
        (key, value) => (typeof value === "bigint" ? Number(value) : value) // return everything else unchanged
      )

      return response.status(201).send(jsonClient)
    } catch (error: any) {
      console.log(error)
      return response.status(400).send(error.message)
    }
  }
}

@injectable()
export class FilterClientUseCase {
  constructor(
    @inject("ClientRepository")
    private clientRepository: IClientRepository
  ) {}

  async execute(data: TRequest): Promise<Client[] | void> {
    const readClient = await this.clientRepository.findWithFilters(data)
    return readClient
  }
}
