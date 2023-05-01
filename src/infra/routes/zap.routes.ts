import { Router } from "express"
import { GetQRCodeController } from "../../server/modules/zap/GetQRCodeController"
import { SendMessageController } from "../../server/modules/zap/SendMessageController"

const sendMessageController = new SendMessageController()
const getQRCodeController = new GetQRCodeController()
const zapRoutes = Router()

zapRoutes.post("/", sendMessageController.handle)
zapRoutes.propfind("/qrcode", getQRCodeController.handle)

export { zapRoutes }
