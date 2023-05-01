import { Request, Response } from "express"
import { container, inject, injectable } from "tsyringe"
import { IClient } from "../../global/models/IClient"
import { IClientRepository } from "../../global/repositories/IClientRepository"

type TRequest = {
  id?: number
  companyId: number
}

export class ReadClientController {
  async handle(request: Request, response: Response): Promise<Response> {
    try {
      const data = request.body
      const readClientUseCase = container.resolve(ReadClientUseCase)
      const readClient = await readClientUseCase.execute(data)

      const jsonClient = JSON.stringify(
        readClient,
        (key, value) => (typeof value === "bigint" ? Number(value) : value) // return everything else unchanged
      )

      return response.status(201).send(jsonClient)
    } catch (error: any) {
      return response.status(400).send(error.message)
    }
  }
}

@injectable()
export class ReadClientUseCase {
  constructor(
    @inject("ClientRepository")
    private clientRepository: IClientRepository
  ) {}

  async execute(data: TRequest): Promise<IClient[] | void> {
    const readClient = await this.clientRepository.find(data)
    return readClient
  }
}
