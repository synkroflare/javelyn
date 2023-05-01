import { JsonValue } from "infra/types"

export interface IGroup {
  id: number
  companyId: number
  creatorId: number
  name: string
  description: string
  filters: JsonValue

  javelynThrows: number
  javelynThrowsDates: Date[]

  statusTrashed: boolean

  createdAt: Date
  updatedAt: Date
  trashedAt: Date | null
}
