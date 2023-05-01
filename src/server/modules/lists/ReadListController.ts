import { Request, Response } from "express"
import { container, inject, injectable } from "tsyringe"
import { IList } from "../../global/models/IList"
import {
  IListRepository,
  TFindListData,
} from "../../global/repositories/IListRepository"

export class ReadListController {
  async handle(request: Request, response: Response): Promise<Response> {
    try {
      const data = request.body
      const readListUseCase = container.resolve(ReadListUseCase)
      const readList = await readListUseCase.execute(data)

      const jsonData = JSON.stringify(
        readList,
        (key, value) => (typeof value === "bigint" ? Number(value) : value) // return everything else unchanged
      )

      return response.status(201).send(jsonData)
    } catch (error: any) {
      return response.status(400).send(error.message)
    }
  }
}

@injectable()
export class ReadListUseCase {
  constructor(
    @inject("ListRepository")
    private listRepository: IListRepository
  ) {}

  async execute(data: TFindListData): Promise<IList[] | void> {
    const readList = await this.listRepository.find(data)
    return readList
  }
}
