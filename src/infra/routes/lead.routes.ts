import { Router } from "express"
import { CreateLeadController } from "../../server/modules/leads/CreateLeadController"
import { ReadLeadController } from "../../server/modules/leads/ReadLeadController"
import { FindLeadsController } from "../../server/modules/leads/FindLeadsController"
import { UpdateLeadController } from "../../server/modules/leads/UpdateLeadController"
import { UpdateManyLeadController } from "../../server/modules/leads/UpdateManyLeadController"
import { NewLeadEntryController } from "../../server/modules/leads/specials/NewLeadEntryController"

const readLeadController = new ReadLeadController()
const newEntryLeadController = new NewLeadEntryController()
const findLeadsController = new FindLeadsController()
const createLeadController = new CreateLeadController()
const updateLeadController = new UpdateLeadController()
const updateManyLeadController = new UpdateManyLeadController()

const leadRoutes = Router()

leadRoutes.propfind("/read", readLeadController.handle)
leadRoutes.propfind("/find", findLeadsController.handle)
leadRoutes.post("/", createLeadController.handle)
leadRoutes.patch("/update", updateLeadController.handle)
leadRoutes.patch("/sf/new-entry/", newEntryLeadController.handle)
leadRoutes.patch("/update-many", updateManyLeadController.handle)

export { leadRoutes }
