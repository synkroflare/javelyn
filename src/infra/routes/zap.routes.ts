import { Router } from "express"
import { HandleConnectionController } from "../../server/modules/zap/HandleConnectionController"
import { SendMessageController } from "../../server/modules/zap/SendMessageController"

const sendMessageController = new SendMessageController()
const handleConnectionController = new HandleConnectionController()
const zapRoutes = Router()

zapRoutes.post("/", sendMessageController.handle)
zapRoutes.propfind("/handle-connection", handleConnectionController.handle)

export { zapRoutes }
