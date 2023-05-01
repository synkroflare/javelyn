import { Router } from "express"
import { CreateEventController } from "../../server/modules/events/CreateEventController"
import { ReadEventController } from "../../server/modules/events/ReadEventController"
import { UpdateEventController } from "../../server/modules/events/UpdateEventController"

const readEventController = new ReadEventController()
const createEventController = new CreateEventController()
const updateEventController = new UpdateEventController()

const eventRoutes = Router()

eventRoutes.propfind("/", readEventController.handle)
eventRoutes.post("/", createEventController.handle)
eventRoutes.patch("/", updateEventController.handle)

export { eventRoutes }
