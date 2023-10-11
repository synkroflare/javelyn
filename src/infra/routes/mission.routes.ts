import { Router } from "express"
import { FindMissionsController } from "../../server/modules/missions/FindMissionController"
import { CreateMissionController } from "../../server/modules/missions/CreateMissionController"
import { ReadMissionsController } from "../../server/modules/missions/ReadMissionController"
import { UpdateMissionController } from "../../server/modules/missions/UpdateMissionController"

const readMissionController = new ReadMissionsController()
const findMissionController = new FindMissionsController()
const createMissionController = new CreateMissionController()
const updateMissionController = new UpdateMissionController()

const missionRoutes = Router()

missionRoutes.propfind("/read", readMissionController.handle)
missionRoutes.propfind("/find", findMissionController.handle)
missionRoutes.post("/", createMissionController.handle)
missionRoutes.patch("/", updateMissionController.handle)

export { missionRoutes }
