import { Router } from "express"
import { CreateTicketController } from "../../server/modules/tickets/CreateTicketController"
import { DeleteTicketController } from "../../server/modules/tickets/DeleteTicketController"
import { FindTicketController } from "../../server/modules/tickets/FindTicketController"
import { ReadTicketController } from "../../server/modules/tickets/ReadTicketController"
import { UpdateTicketController } from "../../server/modules/tickets/UpdateTicketController"

const readTicketController = new ReadTicketController()
const findTicketController = new FindTicketController()
const createTicketController = new CreateTicketController()
const updateTicketController = new UpdateTicketController()
const deleteTicketController = new DeleteTicketController()

const ticketRoutes = Router()

ticketRoutes.propfind("/read", readTicketController.handle)
ticketRoutes.propfind("/find", findTicketController.handle)
ticketRoutes.post("/", createTicketController.handle)
ticketRoutes.patch("/update", updateTicketController.handle)
ticketRoutes.delete("/", deleteTicketController.handle)

export { ticketRoutes }
