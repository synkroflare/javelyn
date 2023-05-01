export interface ISpreadsheetRepository {
  import(data: any): Promise<any>
}
