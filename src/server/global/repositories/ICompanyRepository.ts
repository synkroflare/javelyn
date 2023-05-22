import { Prisma } from "@prisma/client"
import { ICompany } from "../models/ICompany"

export type TFindCompanyData = {
  where: {
    id: number
  }
  include: any
}

export interface ICompanyRepository {
  find(data: TFindCompanyData): Promise<ICompany | null>
}
