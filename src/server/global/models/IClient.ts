export interface IClient {
  id: number
  uuid: string | null
  name: string
  cpf?: string | null
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

  neighborhood?: string | null
  adress?: string | null
  zipCode?: number | null
  houseNumber?: number | null
  profession?: string | null
  birthday?: Date | null
  birthdayDay?: number | null
  birthdayMonth?: number | null
  birthdayYear?: number | null

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
