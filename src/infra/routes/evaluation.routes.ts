import { Router } from "express"
import { CreateEvaluationController } from "../../server/modules/evaluations/CreateEvaluationController"
import { ReadEvaluationController } from "../../server/modules/evaluations/ReadEvaluationController"
import { FindEvaluationsController } from "../../server/modules/evaluations/FindEvaluationsController"
import { UpdateEvaluationController } from "../../server/modules/evaluations/UpdateEvaluationController"
import { UpdateManyEvaluationController } from "../../server/modules/evaluations/UpdateManyEvaluationController"

const readEvaluationController = new ReadEvaluationController()
const findEvaluationsController = new FindEvaluationsController()
const createEvaluationController = new CreateEvaluationController()
const updateEvaluationController = new UpdateEvaluationController()
const updateManyEvaluationController = new UpdateManyEvaluationController()

const evaluationRoutes = Router()

evaluationRoutes.propfind("/read", readEvaluationController.handle)
evaluationRoutes.propfind("/find", findEvaluationsController.handle)
evaluationRoutes.post("/", createEvaluationController.handle)
evaluationRoutes.patch("/update", updateEvaluationController.handle)
evaluationRoutes.patch("/update-many", updateManyEvaluationController.handle)

export { evaluationRoutes }
