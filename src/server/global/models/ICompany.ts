export interface ICompany {
  id: number
  name: string
  email: string
  phone1: string
  phone2: string | undefined | null
  plan: string
  zapQrcode: string
  activeClientTreshold: number
}
