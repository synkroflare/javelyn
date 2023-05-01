export interface ITicket {
  type: string
  creatorUserId: number | null
  assignedUserId: number | null
  permitedUserIds: number[]
  procedureNames: string[]
  clientId: number | null
  clientName: string
  companyId: number
  value: number | null
  salesCode: number | null
  salesmanName: string | null
  salesChannel: string | null

  procedureTypeInjetavelCount: number
  procedureTypeCorporalCount: number
  procedureTypeFacialCount: number

  returnDate: Date | null
  assignedDate: Date | null
  postponedDate: Date | null
  doneDate: Date | null

  statusPostponed: Boolean
  statusDone: Boolean
  statusCanceled: Boolean
  statusTrashed: Boolean
}
