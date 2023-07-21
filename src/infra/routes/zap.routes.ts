import { Router } from "express"
import { ShutdownConnectionsController } from "../../server/modules/zap/ShutdownConnectionsController"
import { HandleConnectionController } from "../../server/modules/zap/HandleConnectionController"
import { SendMessageController } from "../../server/modules/zap/SendMessageController"
import { DisconnectController } from "../../server/modules/zap/DisconnectController"
import { VerifyConnectionController } from "../../server/modules/zap/VerifyConnectionController"

const sendMessageController = new SendMessageController()
const handleConnectionController = new HandleConnectionController()
const verifyConnectionController = new VerifyConnectionController()
const shutdownConnectionsController = new ShutdownConnectionsController()
const disconnectController = new DisconnectController()
const zapRoutes = Router()

zapRoutes.post("/", sendMessageController.handle)
zapRoutes.propfind("/handle-connection", handleConnectionController.handle)
zapRoutes.propfind("/verify-connection", verifyConnectionController.handle)
zapRoutes.patch("/shutdown-all", shutdownConnectionsController.handle)
zapRoutes.patch("/disconnect", disconnectController.handle)

export { zapRoutes }
