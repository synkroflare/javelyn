import { Router } from "express"
import { UpdateAllGroupsController } from "../../server/modules/groups/UpdateAllGroupsController"
import { CreateGroupController } from "../../server/modules/groups/CreateGroupController"
import { ReadGroupController } from "../../server/modules/groups/ReadGroupController"
import { UpdateGroupController } from "../../server/modules/groups/UpdateGroupController"
import { UpdateGroupParticipantsController } from "../../server/modules/groups/UpdateGroupParticipantsController"

const readGroupController = new ReadGroupController()
const createGroupController = new CreateGroupController()
const updateGroupController = new UpdateGroupController()
const updateGroupParticipantsController =
  new UpdateGroupParticipantsController()
const updateAllGroupsController = new UpdateAllGroupsController()

const groupRoutes = Router()

groupRoutes.propfind("/", readGroupController.handle)
groupRoutes.post("/", createGroupController.handle)
groupRoutes.patch("/", updateGroupController.handle)
groupRoutes.patch("/update-all", updateAllGroupsController.handle)
groupRoutes.patch(
  "/update-participants",
  updateGroupParticipantsController.handle
)

export { groupRoutes }
