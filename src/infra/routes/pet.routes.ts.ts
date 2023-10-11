import { Router } from "express"
import { FindPetsController } from "../../server/modules/pets/FindController"
import { CreatePetController } from "../../server/modules/pets/CreateController"
import { ReadPetsController } from "../../server/modules/pets/ReadController"
import { UpdatePetController } from "../../server/modules/pets/UpdateController"

const readPetController = new ReadPetsController()
const findPetController = new FindPetsController()
const createPetController = new CreatePetController()
const updatePetController = new UpdatePetController()

const petRoutes = Router()

petRoutes.propfind("/read", readPetController.handle)
petRoutes.propfind("/find", findPetController.handle)
petRoutes.post("/", createPetController.handle)
petRoutes.patch("/", updatePetController.handle)

export { petRoutes }
