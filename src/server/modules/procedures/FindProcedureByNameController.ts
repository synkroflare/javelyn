import { Request, Response } from "express"
import { container, inject, injectable } from "tsyringe"
import { IProcedure } from "../../global/models/IProcedure"
import { IProcedureRepository } from "../../global/repositories/IProcedureRepository"

type TRequest = {
  id?: number
  companyId: number
  name: string
}

export class FindProcedureByNameController {
  async handle(request: Request, response: Response): Promise<Response> {
    try {
      const data = request.body
      const findProcedureUseCase = container.resolve(FindProcedureByNameUseCase)
      const findProcedure = await findProcedureUseCase.execute(data)

      const json = JSON.stringify(
        findProcedure,
        (key, value) => (typeof value === "bigint" ? Number(value) : value) // return everything else unchanged
      )

      return response.status(201).send(json)
    } catch (error: any) {
      return response.status(400).send(error.message)
    }
  }
}

@injectable()
export class FindProcedureByNameUseCase {
  constructor(
    @inject("ProcedureRepository")
    private procedureRepository: IProcedureRepository
  ) {}

  async execute(data: TRequest): Promise<IProcedure[] | void> {
    const findProcedure = await this.procedureRepository.findByName(data)
    return findProcedure
  }
}
