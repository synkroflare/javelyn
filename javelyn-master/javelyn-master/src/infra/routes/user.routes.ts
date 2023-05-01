import { Router } from "express"
import { CreateUserController } from "../../server/modules/users/CreateUserController"
import { DeleteUserController } from "../../server/modules/users/DeleteUserController"
import { FindUserByNameController } from "../../server/modules/users/FindUserByNameController"
import { ReadUserController } from "../../server/modules/users/ReadUserController"
import { UpdateUserController } from "../../server/modules/users/UpdateUserController"

const readUserController = new ReadUserController()
const findUserController = new FindUserByNameController()
const createUserController = new CreateUserController()
const updateUserController = new UpdateUserController()
const deleteUserController = new DeleteUserController()

const userRoutes = Router()

userRoutes.propfind("/", readUserController.handle)
userRoutes.propfind("/find/", findUserController.handle)
userRoutes.post("/", createUserController.handle)
userRoutes.patch("/", updateUserController.handle)
userRoutes.delete("/", deleteUserController.handle)

export { userRoutes }
