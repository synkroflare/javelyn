import { Router } from "express";
import { TaskToClientDeactivateController } from "../../server/modules/tasks/conclusions/TaskToClientDeactivateController";
import { TaskToTicketController } from "../../server/modules/tasks/conclusions/TaskToDeactivationController";
import { TaskToEvaluationController } from "../../server/modules/tasks/conclusions/TaskToEvaluationController";
import { TaskToEvaluationRescheduleController } from "../../server/modules/tasks/conclusions/TaskToEvaluationRescheduleController";
import { TaskToLeadDeactivateController } from "../../server/modules/tasks/conclusions/TaskToLeadDeactivateController";
import { TaskToQuoteController } from "../../server/modules/tasks/conclusions/TaskToQuoteController";
import { TaskToQuoteDeactivateController } from "../../server/modules/tasks/conclusions/TaskToQuoteDeactivateController";
import { TaskToRescueController } from "../../server/modules/tasks/conclusions/TaskToRescueController";
import { TaskToTaskController } from "../../server/modules/tasks/conclusions/TaskToTaskController";
import { TaskToTaskQuoteController } from "../../server/modules/tasks/conclusions/TaskToTaskQuoteController";
import { CreateManyTaskController } from "../../server/modules/tasks/CreateManyTaskController";
import { CreateTaskController } from "../../server/modules/tasks/CreateTaskController";
import { FindTasksController } from "../../server/modules/tasks/FindTasksController";
import { ReadTaskController } from "../../server/modules/tasks/ReadTaskController";
import { UpdateManyTaskController } from "../../server/modules/tasks/UpdateManyTaskController";
import { UpdateTaskController } from "../../server/modules/tasks/UpdateTaskController";

const readTaskController = new ReadTaskController();
const findTasksController = new FindTasksController();
const createTaskController = new CreateTaskController();
const createManyTaskController = new CreateManyTaskController();
const updateTaskController = new UpdateTaskController();
const updateManyTaskController = new UpdateManyTaskController();
const taskToEvaluationController = new TaskToEvaluationController();
const taskToEvaluationRescheduleController =
  new TaskToEvaluationRescheduleController();
const taskToQuoteController = new TaskToQuoteController();
const taskToTaskQuoteController = new TaskToTaskQuoteController();
const taskToTicketController = new TaskToTicketController();
const taskToTaskController = new TaskToTaskController();
const taskToLeadDeactivateController = new TaskToLeadDeactivateController();
const taskToClientDeactivateController = new TaskToClientDeactivateController();
const taskToQuoteDeactivateController = new TaskToQuoteDeactivateController();
const taskToRescueController = new TaskToRescueController();

const taskRoutes = Router();

taskRoutes.propfind("/read", readTaskController.handle);
taskRoutes.propfind("/find", findTasksController.handle);
taskRoutes.post("/", createTaskController.handle);
taskRoutes.post("/create-many", createManyTaskController.handle);
taskRoutes.patch("/update", updateTaskController.handle);
taskRoutes.patch("/update-many", updateManyTaskController.handle);
taskRoutes.patch("/cc/task-to-task", taskToTaskController.handle);
taskRoutes.patch("/cc/task-to-evaluation", taskToEvaluationController.handle);
taskRoutes.patch(
  "/cc/task-to-evaluation-reschedule",
  taskToEvaluationRescheduleController.handle
);
taskRoutes.patch("/cc/task-to-quote", taskToQuoteController.handle);
taskRoutes.patch("/cc/task-to-task-quote", taskToTaskQuoteController.handle);
taskRoutes.patch("/cc/task-to-ticket", taskToTicketController.handle);
taskRoutes.patch(
  "/cc/task-to-lead-deactivation",
  taskToLeadDeactivateController.handle
);
taskRoutes.patch(
  "/cc/task-to-client-deactivation",
  taskToClientDeactivateController.handle
);
taskRoutes.patch(
  "/cc/task-to-quote-deactivation",
  taskToQuoteDeactivateController.handle
);
taskRoutes.patch("/cc/task-to-rescue", taskToRescueController.handle);

export { taskRoutes };
