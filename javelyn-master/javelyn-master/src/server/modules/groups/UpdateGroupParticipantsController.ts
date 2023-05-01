import { Request, Response } from "express"
import { IClient } from "server/global/models/IClient"
import { IGroup } from "server/global/models/IGroup"
import { container, inject, injectable } from "tsyringe"
import {
  IGroupRepository,
  TUpdateGroupParticipantsData,
} from "../../global/repositories/IGroupRepository"

export class UpdateGroupParticipantsController {
  async handle(request: Request, response: Response): Promise<Response> {
    try {
      const data = request.body
      const updateGroupParticipantsUseCase = container.resolve(
        UpdateGroupParticipantsUseCase
      )
      const updateGroupParticipants =
        await updateGroupParticipantsUseCase.execute(data)

      const jsonData = JSON.stringify(
        updateGroupParticipants,
        (key, value) => (typeof value === "bigint" ? Number(value) : value) // return everything else unchanged
      )

      return response.status(201).send(jsonData)
    } catch (error: any) {
      return response.status(400).send(error.message)
    }
  }
}

@injectable()
export class UpdateGroupParticipantsUseCase {
  constructor(
    @inject("GroupRepository")
    private groupRepository: IGroupRepository
  ) {}

  async execute(
    data: TUpdateGroupParticipantsData
  ): Promise<{
    clientsEntering: IClient[]
    clientsLeaving: IClient[]
    updatedGroup: IGroup
  } | void> {
    const updateGroupParticipants =
      await this.groupRepository.updateParticipants(data)
    return updateGroupParticipants
  }
}
