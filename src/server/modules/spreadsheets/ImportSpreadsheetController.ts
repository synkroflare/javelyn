import { Request, Response } from "express"
import { container, inject, injectable } from "tsyringe"
import { ISpreadsheetRepository } from "../../global/repositories/ISpreadsheetRepository"

type TRequest = {
  type: string
  userId: number
}

export class ImportSpreadsheetController {
  async handle(request: Request, response: Response): Promise<Response> {
    try {
      const data = request.body
      const importSpreadsheetUseCase = container.resolve(
        ImportSpreadsheetUseCase
      )
      const importSpreadsheet = await importSpreadsheetUseCase.execute(data)

      return response.status(201).send(importSpreadsheet)
    } catch (error: any) {
      return response.status(400).send(error.message)
    }
  }
}

@injectable()
export class ImportSpreadsheetUseCase {
  constructor(
    @inject("SpreadsheetRepository")
    private spreadsheetRepository: ISpreadsheetRepository
  ) {}

  async execute(data: TRequest): Promise<any | void> {
    const importSpreadsheet = await this.spreadsheetRepository.import(data)
    return importSpreadsheet
  }
}
