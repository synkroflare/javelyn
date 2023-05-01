import { Request, Response } from "express"
import { container, inject, injectable } from "tsyringe"
import { IProcedure } from "../../global/models/IProcedure"
import { IProcedureRepository } from "../../global/repositories/IProcedureRepository"

type TRequest = {
  type: string
  name: string
  value: number
  userId: number
  companyId: number
}

export class CreateProcedureController {
  async handle(request: Request, response: Response): Promise<Response> {
    try {
      const data = request.body
      const createProcedureUseCase = container.resolve(CreateProcedureUseCase)
      const createProcedure = await createProcedureUseCase.execute(data)

      return response.status(201).json(createProcedure)
    } catch (error: any) {
      return response.status(400).send(error.message)
    }
  }
}

@injectable()
export class CreateProcedureUseCase {
  constructor(
    @inject("ProcedureRepository")
    private procedureRepository: IProcedureRepository
  ) {}

  async execute(data: TRequest): Promise<IProcedure | void> {
    const createProcedure = await this.procedureRepository.create(data)
    return createProcedure
  }
}
