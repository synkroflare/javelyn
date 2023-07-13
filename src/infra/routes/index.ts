import { Router } from "express"
import { clientRoutes } from "./client.routes"
import { companyRoutes } from "./company.route"
import { evaluationRoutes } from "./evaluation.routes"
import { eventRoutes } from "./event.routes"
import { groupRoutes } from "./group.routes"
import { leadRoutes } from "./lead.routes"
import { listRoutes } from "./list.routes"
import { procedureRoutes } from "./procedure.routes"
import { quoteRoutes } from "./quote.routes"
import { spreadsheetRoutes } from "./spreadsheet.routes"
import { taskRoutes } from "./task.routes"
import { ticketRoutes } from "./ticket.routes"
import { userRoutes } from "./user.routes"
import { zapRoutes } from "./zap.routes"

const router = Router()

router.use("/ticket/", ticketRoutes)
router.use("/user/", userRoutes)
router.use("/client/", clientRoutes)
router.use("/procedure/", procedureRoutes)
router.use("/spreadsheet/", spreadsheetRoutes)
router.use("/zap/", zapRoutes)
router.use("/group/", groupRoutes)
router.use("/list/", listRoutes)
router.use("/event/", eventRoutes)
router.use("/company/", companyRoutes)
router.use("/task/", taskRoutes)
router.use("/lead/", leadRoutes)
router.use("/quote/", quoteRoutes)
router.use("/evaluation/", evaluationRoutes)

export { router }
