import { Router } from "express"
import { CreateGroupController } from "../../server/modules/groups/CreateGroupController"
import { ReadGroupController } from "../../server/modules/groups/ReadGroupController"
import { UpdateGroupController } from "../../server/modules/groups/UpdateGroupController"
import { UpdateGroupParticipantsController } from "../../server/modules/groups/UpdateGroupParticipantsController"

const readGroupController = new ReadGroupController()
const createGroupController = new CreateGroupController()
const updateGroupController = new UpdateGroupController()
const updateGroupParticipantsController =
  new UpdateGroupParticipantsController()

const groupRoutes = Router()

groupRoutes.propfind("/", readGroupController.handle)
groupRoutes.post("/", createGroupController.handle)
groupRoutes.patch("/", updateGroupController.handle)
groupRoutes.patch(
  "/update-participants",
  updateGroupParticipantsController.handle
)

export { groupRoutes }
