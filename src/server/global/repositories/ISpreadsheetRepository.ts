export interface ISpreadsheetRepository {
  import(data: any): Promise<any>
  importHbds(data: any): Promise<any>
}
