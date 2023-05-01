import { Router } from "express"
import { CreateListController } from "../../server/modules/lists/CreateListController"
import { ReadListController } from "../../server/modules/lists/ReadListController"
import { UpdateListController } from "../../server/modules/lists/UpdateListController"

const readListController = new ReadListController()
const createListController = new CreateListController()
const updateListController = new UpdateListController()

const listRoutes = Router()

listRoutes.propfind("/", readListController.handle)
listRoutes.post("/", createListController.handle)
listRoutes.patch("/", updateListController.handle)

export { listRoutes }
