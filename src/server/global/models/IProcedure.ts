export interface IProcedure {
  id: number
  value: number | string | null
  name: string
  type: string | null
  statusTrashed: boolean
  companyId: number
}
