import qrcode from "qrcode-terminal"
import { container } from "tsyringe"
import { Client, LocalAuth } from "whatsapp-web.js"
import { HandleZapQrUpdateController } from "../../server/global/repositories/implementations/helpers/HandleZapQrUpdate"

export const handleZapContainer = () => {
  const client = new Client({
    authStrategy: new LocalAuth(),
    puppeteer: {
      args: ["--no-sandbox"],
    },
  })
  client.initialize()
  client.on("loading_screen", (percent, message) => {
    console.log("LOADING SCREEN", percent, message)
  })
  client.on("qr", (qr) => {
    // NOTE: This event will not be fired if a session is specified.
  })
  client.on("authenticated", () => {
    console.log("AUTHENTICATED")
  })
  client.on("auth_failure", (msg) => {
    // Fired if session restore was unsuccessful
    console.error("AUTHENTICATION FAILURE", msg)
  })
  client.on("ready", () => {
    console.log("READY")
  })
  container.registerInstance<Client>("ZapClient", client)
}
