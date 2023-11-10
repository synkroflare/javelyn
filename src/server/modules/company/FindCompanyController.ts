import { Company } from "@prisma/client"
import { Request, Response } from "express"
import { container, inject, injectable } from "tsyringe"
import {
  ICompanyRepository,
  TFindCompanyData,
} from "../../global/repositories/ICompanyRepository"

export class FindCompanyController {
  async handle(request: Request, response: Response): Promise<Response> {
    try {
      const data = request.body
      const readCompanyUseCase = container.resolve(FindCompanyUseCase)
      const readCompany = await readCompanyUseCase.execute(data)

      const json = JSON.stringify(
        readCompany,
        (key, value) => (typeof value === "bigint" ? Number(value) : value) // return everything else unchanged
      )

      return response.status(201).send(json)
    } catch (error: any) {
      return response.status(400).send(error.message)
    }
  }
}

@injectable()
export class FindCompanyUseCase {
  constructor(
    @inject("CompanyRepository")
    private companyRepository: ICompanyRepository
  ) {}

  async execute(data: TFindCompanyData): Promise<Company | null> {
    const readCompany = await this.companyRepository.find(data)
    return readCompany
  }
}
