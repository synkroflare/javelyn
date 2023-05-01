import { Request, Response } from "express"
import { container, inject, injectable } from "tsyringe"
import { IProcedure } from "../../global/models/IProcedure"
import { IProcedureRepository } from "../../global/repositories/IProcedureRepository"

type TRequest = {
  id?: number
  companyId: number
}

export class FilterProcedureController {
  async handle(request: Request, response: Response): Promise<Response> {
    try {
      const data = request.body
      const readProcedureUseCase = container.resolve(FilterProcedureUseCase)
      const readProcedure = await readProcedureUseCase.execute(data)

      const json = JSON.stringify(
        readProcedure,
        (key, value) => (typeof value === "bigint" ? Number(value) : value) // return everything else unchanged
      )

      return response.status(201).send(json)
    } catch (error: any) {
      return response.status(400).send(error.message)
    }
  }
}

@injectable()
export class FilterProcedureUseCase {
  constructor(
    @inject("ProcedureRepository")
    private procedureRepository: IProcedureRepository
  ) {}

  async execute(data: TRequest): Promise<IProcedure[] | void> {
    const readProcedure = await this.procedureRepository.findWithFilters(data)
    return readProcedure
  }
}
