import { Request, Response } from "express"
import { container, inject, injectable } from "tsyringe"
import { IGroup } from "../../global/models/IGroup"
import {
  IGroupRepository,
  TUpdateGroupData,
  TUpgradeAllGroupsData,
} from "../../global/repositories/IGroupRepository"

export class UpdateAllGroupsController {
  async handle(request: Request, response: Response): Promise<Response> {
    try {
      const data = request.body
      const updateGroupUseCase = container.resolve(UpdateAllGroupsUseCase)
      const updateGroup = await updateGroupUseCase.execute(data)

      return response.status(201).send({ data: updateGroup })
    } catch (error: any) {
      return response.status(400).send(error.message)
    }
  }
}

@injectable()
export class UpdateAllGroupsUseCase {
  constructor(
    @inject("GroupRepository")
    private groupRepository: IGroupRepository
  ) {}

  async execute(data: TUpgradeAllGroupsData): Promise<string> {
    const updateGroup = await this.groupRepository.updateAllGroups(data)
    return updateGroup
  }
}
