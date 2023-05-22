import { Prisma, PrismaClient } from "@prisma/client"
import { inject, injectable } from "tsyringe"
import { ICompany } from "../../models/ICompany"
import { ICompanyRepository, TFindCompanyData } from "../ICompanyRepository"

@injectable()
export class CompanyFunctionsRepository implements ICompanyRepository {
  constructor(
    @inject("PrismaClient")
    private readonly client: PrismaClient
  ) {}

  async find(data: TFindCompanyData): Promise<ICompany | null> {
    return await this.client.company.findFirst(data)
  }
}
