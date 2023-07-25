import { Router } from "express"
import { ReadUserController } from "../../server/modules/users/ReadUserController"
import { CreateUserController } from "../../server/modules/users/CreateUserController"
import { DeleteUserController } from "../../server/modules/users/DeleteUserController"
import { FindUserByNameController } from "../../server/modules/users/FindUserByNameController"
import { FindUserController } from "../../server/modules/users/FindUserController"
import { UpdateUserController } from "../../server/modules/users/UpdateUserController"

const findUserController = new FindUserController()
const readUserController = new ReadUserController()
const findByNameUserController = new FindUserByNameController()
const createUserController = new CreateUserController()
const updateUserController = new UpdateUserController()
const deleteUserController = new DeleteUserController()

const userRoutes = Router()

userRoutes.propfind("/find", findUserController.handle)
userRoutes.propfind("/read", readUserController.handle)
userRoutes.propfind("/find-by-name/", findByNameUserController.handle)
userRoutes.post("/", createUserController.handle)
userRoutes.patch("/", updateUserController.handle)
userRoutes.delete("/", deleteUserController.handle)

export { userRoutes }
