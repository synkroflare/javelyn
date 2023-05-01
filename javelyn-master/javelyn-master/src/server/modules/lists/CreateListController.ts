import { Request, Response } from "express"
import { container, inject, injectable } from "tsyringe"
import { IList } from "../../global/models/IList"
import {
  IListRepository,
  TCreateListData,
} from "../../global/repositories/IListRepository"

export class CreateListController {
  async handle(request: Request, response: Response): Promise<Response> {
    try {
      const data = request.body
      const createListUseCase = container.resolve(CreateListUseCase)
      const createList = await createListUseCase.execute(data)

      const jsonData = JSON.stringify(
        createList,
        (key, value) => (typeof value === "bigint" ? Number(value) : value) // return everything else unchanged
      )

      return response.status(201).send(jsonData)
    } catch (error: any) {
      return response.status(400).send(error.message)
    }
  }
}

@injectable()
export class CreateListUseCase {
  constructor(
    @inject("ListRepository")
    private listRepository: IListRepository
  ) {}

  async execute(data: TCreateListData): Promise<IList | void> {
    const createList = await this.listRepository.create(data)
    return createList
  }
}
