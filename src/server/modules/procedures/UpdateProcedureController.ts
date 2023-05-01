import { Request, Response } from "express"
import { container, inject, injectable } from "tsyringe"
import { IProcedure } from "../../global/models/IProcedure"
import {
  IProcedureRepository,
  TUpdateProcedureData,
} from "../../global/repositories/IProcedureRepository"

export class UpdateProcedureController {
  async handle(request: Request, response: Response): Promise<Response> {
    try {
      const data = request.body
      const updateProcedureUseCase = container.resolve(UpdateProcedureUseCase)
      const updateProcedure = await updateProcedureUseCase.execute(data)

      const json = JSON.stringify(
        updateProcedure,
        (key, value) => (typeof value === "bigint" ? Number(value) : value) // return everything else unchanged
      )

      return response.status(201).send(json)
    } catch (error: any) {
      return response.status(400).send(error.message)
    }
  }
}

@injectable()
export class UpdateProcedureUseCase {
  constructor(
    @inject("ProcedureRepository")
    private procedureRepository: IProcedureRepository
  ) {}

  async execute(data: TUpdateProcedureData): Promise<IProcedure | void> {
    const updateProcedure = await this.procedureRepository.update(data)
    return updateProcedure
  }
}
