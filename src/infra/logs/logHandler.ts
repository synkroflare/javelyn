import { Request } from "express"
import { Logger } from "winston"

export const logHandler = async (req: Request, logger: Logger) => {
  if (req.method === "OPTIONS") return

  const newLine = `{
    originalUrl: ${req.originalUrl?.split("?")[0]},
    method: ${req.method},
    body: ${JSON.stringify(req.body)},
    query:  ${JSON.stringify(req.query)},
    date: ${new Date().toString()},
    ip: ${req.ip}
    origin: ${req.get("Origin")}
  },`

  logger.info(newLine)
}
