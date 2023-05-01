import { PrismaClient } from "@prisma/client"
import { IClient } from "../../../../models/IClient"

type TParams = {
  inputData: any
  prismaClient: PrismaClient
  preFilteredClients: IClient[] | void
}
export async function filterClientsWithDate(
  data: TParams
): Promise<IClient[] | void> {
  const filters = data.inputData.filters
  const client = data.prismaClient

  if (!data.preFilteredClients) return []

  const filteredClients: IClient[] = []

  for (const client of data.preFilteredClients) {
  }

  return filteredClients
}
