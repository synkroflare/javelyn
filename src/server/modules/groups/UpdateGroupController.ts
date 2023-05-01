import { Request, Response } from "express"
import { container, inject, injectable } from "tsyringe"
import { IGroup } from "../../global/models/IGroup"
import {
  IGroupRepository,
  TUpdateGroupData,
} from "../../global/repositories/IGroupRepository"

export class UpdateGroupController {
  async handle(request: Request, response: Response): Promise<Response> {
    try {
      const data = request.body
      const updateGroupUseCase = container.resolve(UpdateGroupUseCase)
      const updateGroup = await updateGroupUseCase.execute(data)

      const jsonData = JSON.stringify(
        updateGroup,
        (key, value) => (typeof value === "bigint" ? Number(value) : value) // return everything else unchanged
      )

      return response.status(201).send(jsonData)
    } catch (error: any) {
      return response.status(400).send(error.message)
    }
  }
}

@injectable()
export class UpdateGroupUseCase {
  constructor(
    @inject("GroupRepository")
    private groupRepository: IGroupRepository
  ) {}

  async execute(data: TUpdateGroupData): Promise<IGroup | void> {
    const updateGroup = await this.groupRepository.update(data)
    return updateGroup
  }
}
