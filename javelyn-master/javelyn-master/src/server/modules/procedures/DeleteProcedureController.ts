import { Request, Response } from "express"
import { container, inject, injectable } from "tsyringe"
import { IProcedure } from "../../global/models/IProcedure"
import { IProcedureRepository } from "../../global/repositories/IProcedureRepository"

type TRequest = {
  type: string
  userId: number
  id: number
  companyId: number
}

export class DeleteProcedureController {
  async handle(request: Request, response: Response): Promise<Response> {
    try {
      const data = request.body
      const deleteProcedureUseCase = container.resolve(DeleteProcedureUseCase)
      const deleteProcedure = await deleteProcedureUseCase.execute(data)

      return response.status(201).json(deleteProcedure)
    } catch (error: any) {
      return response.status(400).send(error.message)
    }
  }
}

@injectable()
export class DeleteProcedureUseCase {
  constructor(
    @inject("ProcedureRepository")
    private procedureRepository: IProcedureRepository
  ) {}

  async execute(data: TRequest): Promise<IProcedure | void> {
    const deleteProcedure = await this.procedureRepository.delete(data)
    return deleteProcedure
  }
}
