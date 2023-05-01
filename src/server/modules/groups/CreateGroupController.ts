import { Request, Response } from "express"
import { container, inject, injectable } from "tsyringe"
import { IGroup } from "../../global/models/IGroup"
import {
  IGroupRepository,
  TCreateGroupData,
} from "../../global/repositories/IGroupRepository"

export class CreateGroupController {
  async handle(request: Request, response: Response): Promise<Response> {
    try {
      const data = request.body
      const createGroupUseCase = container.resolve(CreateGroupUseCase)
      const createGroup = await createGroupUseCase.execute(data)

      const jsonData = JSON.stringify(
        createGroup,
        (key, value) => (typeof value === "bigint" ? Number(value) : value) // return everything else unchanged
      )

      return response.status(201).send(jsonData)
    } catch (error: any) {
      return response.status(400).send(error.message)
    }
  }
}

@injectable()
export class CreateGroupUseCase {
  constructor(
    @inject("GroupRepository")
    private groupRepository: IGroupRepository
  ) {}

  async execute(data: TCreateGroupData): Promise<IGroup | void> {
    const createGroup = await this.groupRepository.create(data)
    return createGroup
  }
}
