import { Router } from "express"
import { CreateEvaluationController } from "../../server/modules/evaluations/CreateEvaluationController"
import { ReadEvaluationController } from "../../server/modules/evaluations/ReadEvaluationController"
import { FindEvaluationsController } from "../../server/modules/evaluations/FindEvaluationsController"
import { UpdateEvaluationController } from "../../server/modules/evaluations/UpdateEvaluationController"
import { UpdateManyEvaluationController } from "../../server/modules/evaluations/UpdateManyEvaluationController"
import { EvaluationToAbsenceController } from "../../server/modules/evaluations/conclusions/EvaluationToAbsenceController"
import { EvaluationToTaskController } from "../../server/modules/evaluations/conclusions/EvaluationToTaskController"
import { EvaluationToQuoteController } from "../../server/modules/evaluations/conclusions/EvaluationToQuoteController"

const readEvaluationController = new ReadEvaluationController()
const findEvaluationsController = new FindEvaluationsController()
const createEvaluationController = new CreateEvaluationController()
const updateEvaluationController = new UpdateEvaluationController()
const updateManyEvaluationController = new UpdateManyEvaluationController()
const evaluationToAbsenceController = new EvaluationToAbsenceController()
const evaluationTaskController = new EvaluationToTaskController()
const evaluationToQuoteController = new EvaluationToQuoteController()

const evaluationRoutes = Router()

evaluationRoutes.propfind("/read", readEvaluationController.handle)
evaluationRoutes.propfind("/find", findEvaluationsController.handle)
evaluationRoutes.post("/", createEvaluationController.handle)
evaluationRoutes.patch("/update", updateEvaluationController.handle)
evaluationRoutes.patch("/update-many", updateManyEvaluationController.handle)
evaluationRoutes.patch(
  "/cc/evaluation-to-absence",
  evaluationToAbsenceController.handle
)
evaluationRoutes.patch(
  "/cc/evaluation-to-task",
  evaluationTaskController.handle
)
evaluationRoutes.patch(
  "/cc/evaluation-to-quote",
  evaluationToQuoteController.handle
)

export { evaluationRoutes }
