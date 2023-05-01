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

ticketRoutes.propfind("/", readTicketController.handle)
ticketRoutes.propfind("/filter", findTicketController.handle)
ticketRoutes.post("/", createTicketController.handle)
ticketRoutes.patch("/", updateTicketController.handle)
ticketRoutes.delete("/", deleteTicketController.handle)

export { ticketRoutes }
