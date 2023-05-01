import { Router } from "express"
import { CreateProcedureController } from "../../server/modules/procedures/CreateProcedureController"
import { DeleteProcedureController } from "../../server/modules/procedures/DeleteProcedureController"
import { FilterProcedureController } from "../../server/modules/procedures/FilterProcedureController"
import { FindProcedureByNameController } from "../../server/modules/procedures/FindProcedureByNameController"
import { ReadProcedureController } from "../../server/modules/procedures/ReadProcedureController"
import { UpdateProcedureController } from "../../server/modules/procedures/UpdateProcedureController"

const readProcedureController = new ReadProcedureController()
const findProcedureController = new FindProcedureByNameController()
const createProcedureController = new CreateProcedureController()
const updateProcedureController = new UpdateProcedureController()
const deleteProcedureController = new DeleteProcedureController()
const filterProcedureController = new FilterProcedureController()

const procedureRoutes = Router()

procedureRoutes.propfind("/", readProcedureController.handle)
procedureRoutes.propfind("/find", findProcedureController.handle)
procedureRoutes.propfind("/filter", filterProcedureController.handle)
procedureRoutes.post("/", createProcedureController.handle)
procedureRoutes.patch("/", updateProcedureController.handle)
procedureRoutes.delete("/", deleteProcedureController.handle)

export { procedureRoutes }
