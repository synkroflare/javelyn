import { Request, Response } from "express"
import { container, inject, injectable } from "tsyringe"
import { IGroup } from "../../global/models/IGroup"
import {
  IGroupRepository,
  TFindGroupData,
} from "../../global/repositories/IGroupRepository"

export class ReadGroupController {
  async handle(request: Request, response: Response): Promise<Response> {
    try {
      const data = request.body
      const readGroupUseCase = container.resolve(ReadGroupUseCase)
      const readGroup = await readGroupUseCase.execute(data)

      const jsonData = JSON.stringify(
        readGroup,
        (key, value) => (typeof value === "bigint" ? Number(value) : value) // return everything else unchanged
      )

      return response.status(201).send(jsonData)
    } catch (error: any) {
      return response.status(400).send(error.message)
    }
  }
}

@injectable()
export class ReadGroupUseCase {
  constructor(
    @inject("GroupRepository")
    private groupRepository: IGroupRepository
  ) {}

  async execute(data: TFindGroupData): Promise<IGroup[] | void> {
    const readGroup = await this.groupRepository.find(data)
    return readGroup
  }
}
