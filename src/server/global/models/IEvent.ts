export interface IEvent {
  id: number
  companyId: number

  name: string | null
  type: string
  date: Date
  dateDay: number
  dateMonth: number
  dateYear: number

  statusTrashed: boolean
  statusHandled: boolean

  createdAt: Date
  updatedAt: Date
  handledAt: Date | null
  trashedAt: Date | null
}
