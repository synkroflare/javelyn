import { Router } from "express";
import { EvaluationToAbsenceController } from "../../server/modules/evaluations/conclusions/EvaluationToAbsenceController";
import { EvaluationToDeactivateController } from "../../server/modules/evaluations/conclusions/EvaluationToDeactivateController";
import { EvaluationToQuoteController } from "../../server/modules/evaluations/conclusions/EvaluationToQuoteController";
import { EvaluationToRescheduleController } from "../../server/modules/evaluations/conclusions/EvaluationToRescheduleController";
import { EvaluationToTaskController } from "../../server/modules/evaluations/conclusions/EvaluationToTaskController";
import { CreateEvaluationController } from "../../server/modules/evaluations/CreateEvaluationController";
import { FindEvaluationsController } from "../../server/modules/evaluations/FindEvaluationsController";
import { ReadEvaluationController } from "../../server/modules/evaluations/ReadEvaluationController";
import { UpdateEvaluationController } from "../../server/modules/evaluations/UpdateEvaluationController";
import { UpdateManyEvaluationController } from "../../server/modules/evaluations/UpdateManyEvaluationController";

const readEvaluationController = new ReadEvaluationController();
const findEvaluationsController = new FindEvaluationsController();
const createEvaluationController = new CreateEvaluationController();
const updateEvaluationController = new UpdateEvaluationController();
const updateManyEvaluationController = new UpdateManyEvaluationController();
const evaluationToAbsenceController = new EvaluationToAbsenceController();
const evaluationTaskController = new EvaluationToTaskController();
const evaluationToQuoteController = new EvaluationToQuoteController();
const evaluationToDeactivateController = new EvaluationToDeactivateController();
const evaluationToRescheduleController = new EvaluationToRescheduleController();

const evaluationRoutes = Router();

evaluationRoutes.propfind("/read", readEvaluationController.handle);
evaluationRoutes.propfind("/find", findEvaluationsController.handle);
evaluationRoutes.post("/", createEvaluationController.handle);
evaluationRoutes.patch("/update", updateEvaluationController.handle);
evaluationRoutes.patch("/update-many", updateManyEvaluationController.handle);
evaluationRoutes.patch(
  "/cc/evaluation-to-absence",
  evaluationToAbsenceController.handle
);
evaluationRoutes.patch(
  "/cc/evaluation-to-task",
  evaluationTaskController.handle
);
evaluationRoutes.patch(
  "/cc/evaluation-to-quote",
  evaluationToQuoteController.handle
);
evaluationRoutes.patch(
  "/cc/evaluation-to-deactivate",
  evaluationToDeactivateController.handle
);
evaluationRoutes.patch(
  "/cc/evaluation-to-reschedule",
  evaluationToRescheduleController.handle
);

export { evaluationRoutes };
