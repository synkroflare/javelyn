import { Router } from "express"
import { CreateTaskController } from "../../server/modules/tasks/CreateTaskController"
import { ReadTaskController } from "../../server/modules/tasks/ReadTaskController"
import { FindTasksController } from "../../server/modules/tasks/FindTasksController"
import { UpdateTaskController } from "../../server/modules/tasks/UpdateTaskController"
import { UpdateManyTaskController } from "../../server/modules/tasks/UpdateManyTaskController"
import { CreateManyTaskController } from "../../server/modules/tasks/CreateManyTaskController"

const readTaskController = new ReadTaskController()
const findTasksController = new FindTasksController()
const createTaskController = new CreateTaskController()
const createManyTaskController = new CreateManyTaskController()
const updateTaskController = new UpdateTaskController()
const updateManyTaskController = new UpdateManyTaskController()

const taskRoutes = Router()

taskRoutes.propfind("/read", readTaskController.handle)
taskRoutes.propfind("/find", findTasksController.handle)
taskRoutes.post("/", createTaskController.handle)
taskRoutes.post("/create-many", createManyTaskController.handle)
taskRoutes.patch("/update", updateTaskController.handle)
taskRoutes.patch("/update-many", updateManyTaskController.handle)

export { taskRoutes }
