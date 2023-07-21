import { Router } from "express"
import { UpsertClientController } from "../../server/modules/clients/UpsertClientController"
import { CreateClientController } from "../../server/modules/clients/CreateClientController"
import { DeleteClientController } from "../../server/modules/clients/DeleteClientController"
import { FilterClientController } from "../../server/modules/clients/FilterClientController"
import { FindClientController } from "../../server/modules/clients/FindClientController"
import { HandleClientActiveStatusController } from "../../server/modules/clients/HandleClientActiveStatusController"
import { HomeCheckController } from "../../server/modules/clients/HomeCheckController"
import { ReadClientController } from "../../server/modules/clients/ReadClientController"
import { UpdateClientController } from "../../server/modules/clients/UpdateClientController"
import { UpdateClientProcedureTypeController } from "../../server/modules/clients/UpdateClientProcedureTypeController"

const readClientController = new ReadClientController()
const filterClientController = new FilterClientController()
const findClientController = new FindClientController()
const createClientController = new CreateClientController()
const updateClientController = new UpdateClientController()
const upsertClientController = new UpsertClientController()
const deleteClientController = new DeleteClientController()
const handleActiveController = new HandleClientActiveStatusController()
const updateClientTypeController = new UpdateClientProcedureTypeController()
const homeCheckController = new HomeCheckController()

const clientRoutes = Router()

clientRoutes.propfind("/", readClientController.handle)
clientRoutes.propfind("/filter", filterClientController.handle)
clientRoutes.propfind("/find", findClientController.handle)
clientRoutes.propfind("/homecheck", homeCheckController.handle)
clientRoutes.post("/", createClientController.handle)
clientRoutes.patch("/", updateClientController.handle)
clientRoutes.patch("/handle-active-status", handleActiveController.handle)
clientRoutes.patch("/update-client-type", updateClientTypeController.handle)
clientRoutes.patch("/upsert", upsertClientController.handle)
clientRoutes.delete("/", deleteClientController.handle)

export { clientRoutes }
