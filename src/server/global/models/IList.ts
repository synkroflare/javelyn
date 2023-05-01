import { JsonValue } from "infra/types"

export interface IList {
  id: number
  companyId: number
  creatorId: number
  name: string
  description: string
  filters: JsonValue

  javelynThrowsDates: Date[]

  statusTrashed: boolean

  createdAt: Date
  updatedAt: Date
  trashedAt: Date | null
}
