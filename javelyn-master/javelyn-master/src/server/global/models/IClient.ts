export interface IClient {
  id: number
  uuid: string
  name: string
  phone?: string | null
  mail?: string | null
  rank: number
  companyId: number
  age: number | null
  totalSpent: number | null
  canceledTickets: number | null
  acomplishedTickets: number | null
  absences: number | null
  daysSinceLastTicket: number

  neighborhood?: string
  adress?: string
  zipCode?: number
  houseNumber?: number
  profession?: string
  birthday?: Date
  birthdayDay?: number
  birthdayMonth?: number
  birthdayYear?: number

  statusTrashed: boolean | null
  statusActive: boolean | null

  procedureTypeInjetavelCount: number | null
  procedureTypeCorporalCount: number | null
  procedureTypeFacialCount: number | null
  procedureTotalCount: number | null

  javelynEntryDates: Date[]
  flexusEntryDates: Date[]
  trashedAt: Date | null
}
