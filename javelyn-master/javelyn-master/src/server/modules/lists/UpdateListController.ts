import { Request, Response } from "express"
import { container, inject, injectable } from "tsyringe"
import { IList } from "../../global/models/IList"
import {
  IListRepository,
  TUpdateListData,
} from "../../global/repositories/IListRepository"

export class UpdateListController {
  async handle(request: Request, response: Response): Promise<Response> {
    try {
      const data = request.body
      const updateListUseCase = container.resolve(UpdateListUseCase)
      const updateList = await updateListUseCase.execute(data)

      const jsonData = JSON.stringify(
        updateList,
        (key, value) => (typeof value === "bigint" ? Number(value) : value) // return everything else unchanged
      )

      return response.status(201).send(jsonData)
    } catch (error: any) {
      return response.status(400).send(error.message)
    }
  }
}

@injectable()
export class UpdateListUseCase {
  constructor(
    @inject("ListRepository")
    private listRepository: IListRepository
  ) {}

  async execute(data: TUpdateListData): Promise<IList | void> {
    const updateList = await this.listRepository.update(data)
    return updateList
  }
}
