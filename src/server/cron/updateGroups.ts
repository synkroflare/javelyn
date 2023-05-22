import { IGroup } from "../../server/global/models/IGroup"
import { IGroupRepository } from "../../server/global/repositories/IGroupRepository"
import { container } from "tsyringe"

type TUpdateGroupsParams = {
  groups: IGroup[]
  companyId: number
}

export const updatedGroups = async ({
  groups,
  companyId,
}: TUpdateGroupsParams) => {
  const groupRepository = container.resolve<IGroupRepository>("GroupRepository")
  const promiseArray: any = []
  groups.forEach(async (group) => {
    const updatedGroup = await groupRepository.updateParticipants({
      companyId: companyId,
      filters: group.filters,
      id: group.id,
      mode: "AUTOMATIC",
    })
    promiseArray.push(updatedGroup)
  })
  Promise.all(promiseArray)

  return "done"
}
