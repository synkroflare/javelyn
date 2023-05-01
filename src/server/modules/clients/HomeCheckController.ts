import { Request, Response } from "express"
import { container, inject, injectable } from "tsyringe"
import { IClient } from "../../global/models/IClient"
import { IClientRepository } from "../../global/repositories/IClientRepository"

type TRequest = {
  id?: number
  companyId: number
}

export class HomeCheckController {
  async handle(request: Request, response: Response): Promise<Response> {
    try {
      const data = request.body
      const homeCheckUseCase = container.resolve(HomeCheckUseCase)
      const homeCheck = await homeCheckUseCase.execute(data)

      const jsonClient = JSON.stringify(
        homeCheck,
        (key, value) => (typeof value === "bigint" ? Number(value) : value) // return everything else unchanged
      )

      return response.status(201).send(jsonClient)
    } catch (error: any) {
      return response.status(400).send(error.message)
    }
  }
}

@injectable()
export class HomeCheckUseCase {
  constructor(
    @inject("ClientRepository")
    private clientRepository: IClientRepository
  ) {}

  async execute(data: TRequest): Promise<IClient[] | void> {
    const homeCheck = await this.clientRepository.homeCheck(data)
    return homeCheck
  }
}
