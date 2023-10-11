import { Router } from "express"
import { FindItemsController } from "../../server/modules/items/FindController"
import { CreateItemController } from "../../server/modules/items/CreateController"
import { ReadItemsController } from "../../server/modules/items/ReadController"
import { UpdateItemController } from "../../server/modules/items/UpdateController"

const readItemController = new ReadItemsController()
const findItemController = new FindItemsController()
const createItemController = new CreateItemController()
const updateItemController = new UpdateItemController()

const itemRoutes = Router()

itemRoutes.propfind("/read", readItemController.handle)
itemRoutes.propfind("/find", findItemController.handle)
itemRoutes.post("/", createItemController.handle)
itemRoutes.patch("/", updateItemController.handle)

export { itemRoutes }
